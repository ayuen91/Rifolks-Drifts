-- COD Orders Table
CREATE TABLE cod_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    cod_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending',
    delivery_status VARCHAR(20) NOT NULL DEFAULT 'pending',
    delivery_attempts INTEGER NOT NULL DEFAULT 0,
    assigned_delivery_staff UUID REFERENCES users(id),
    try_on_requested BOOLEAN DEFAULT false,
    try_on_fee DECIMAL(10,2) DEFAULT 0,
    try_on_status VARCHAR(20) DEFAULT 'pending',
    try_on_start_time TIMESTAMP WITH TIME ZONE,
    try_on_end_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Delivery Attempts Table
CREATE TABLE delivery_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cod_order_id UUID REFERENCES cod_orders(id) ON DELETE CASCADE,
    attempt_number INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL,
    notes TEXT,
    payment_amount DECIMAL(10,2),
    payment_status VARCHAR(20),
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Returns Table
CREATE TABLE returns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cod_order_id UUID REFERENCES cod_orders(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    return_fee DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    processed_by UUID REFERENCES users(id),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment Reconciliation Table
CREATE TABLE payment_reconciliation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cod_order_id UUID REFERENCES cod_orders(id) ON DELETE CASCADE,
    expected_amount DECIMAL(10,2) NOT NULL,
    collected_amount DECIMAL(10,2) NOT NULL,
    discrepancy DECIMAL(10,2),
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    reconciled_by UUID REFERENCES users(id),
    reconciled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer Feedback Table
CREATE TABLE customer_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cod_order_id UUID REFERENCES cod_orders(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    try_on_satisfaction BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- COD Rules Table
CREATE TABLE cod_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rule_type VARCHAR(50) NOT NULL,
    rule_value JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies
ALTER TABLE cod_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_reconciliation ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE cod_rules ENABLE ROW LEVEL SECURITY;

-- Policies for cod_orders
CREATE POLICY "Users can view their own COD orders"
    ON cod_orders FOR SELECT
    USING (auth.uid() = order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all COD orders"
    ON cod_orders FOR SELECT
    USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Delivery staff can view assigned orders"
    ON cod_orders FOR SELECT
    USING (auth.uid() = assigned_delivery_staff);

-- Policies for delivery_attempts
CREATE POLICY "Users can view their own delivery attempts"
    ON delivery_attempts FOR SELECT
    USING (auth.uid() IN (
        SELECT user_id FROM orders 
        WHERE id = (SELECT order_id FROM cod_orders WHERE id = cod_order_id)
    ));

CREATE POLICY "Delivery staff can update delivery attempts"
    ON delivery_attempts FOR ALL
    USING (auth.uid() IN (
        SELECT assigned_delivery_staff FROM cod_orders WHERE id = cod_order_id
    ));

-- Policies for returns
CREATE POLICY "Users can view their own returns"
    ON returns FOR SELECT
    USING (auth.uid() IN (
        SELECT user_id FROM orders 
        WHERE id = (SELECT order_id FROM cod_orders WHERE id = cod_order_id)
    ));

CREATE POLICY "Admins can manage returns"
    ON returns FOR ALL
    USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Policies for payment_reconciliation
CREATE POLICY "Admins can manage payment reconciliation"
    ON payment_reconciliation FOR ALL
    USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Policies for customer_feedback
CREATE POLICY "Users can view their own feedback"
    ON customer_feedback FOR SELECT
    USING (auth.uid() IN (
        SELECT user_id FROM orders 
        WHERE id = (SELECT order_id FROM cod_orders WHERE id = cod_order_id)
    ));

CREATE POLICY "Users can create feedback"
    ON customer_feedback FOR INSERT
    WITH CHECK (auth.uid() IN (
        SELECT user_id FROM orders 
        WHERE id = (SELECT order_id FROM cod_orders WHERE id = cod_order_id)
    ));

-- Policies for cod_rules
CREATE POLICY "Admins can manage COD rules"
    ON cod_rules FOR ALL
    USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Indexes for better performance
CREATE INDEX idx_cod_orders_order_id ON cod_orders(order_id);
CREATE INDEX idx_cod_orders_assigned_staff ON cod_orders(assigned_delivery_staff);
CREATE INDEX idx_delivery_attempts_cod_order ON delivery_attempts(cod_order_id);
CREATE INDEX idx_returns_cod_order ON returns(cod_order_id);
CREATE INDEX idx_payment_reconciliation_cod_order ON payment_reconciliation(cod_order_id);
CREATE INDEX idx_customer_feedback_cod_order ON customer_feedback(cod_order_id); 