const express = require('express');
const router = express.Router();
const { supabase } = require('../utils/supabase');
const { logger } = require('../utils/logger');

// Get COD rules
router.get('/rules', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cod_rules')
      .select('*')
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    logger.error('Error fetching COD rules:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update COD rules
router.put('/rules', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cod_rules')
      .update(req.body)
      .eq('id', 1)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    logger.error('Error updating COD rules:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 