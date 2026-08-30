// API Route: /api/trends/cfb
// GET endpoint to retrieve CFB prop trends
// Query params: ?year=2025&drafted=false&sort=hitrate

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { year, drafted, prop_type, school, sort } = req.query;

    let query = supabase.from('cfb.prop_trends').select('*');

    // Apply filters
    if (year) query = query.eq('year', parseInt(year));
    if (drafted !== undefined) query = query.eq('drafted', drafted === 'true');
    if (prop_type) query = query.eq('prop_type', prop_type);
    if (school) query = query.eq('school', school.toUpperCase());

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    // Process: Calculate hit rates per player+prop combo
    const trends = {};
    data.forEach(row => {
      const key = `${row.player_name}|${row.prop_type}`;
      if (!trends[key]) {
        trends[key] = {
          player_name: row.player_name,
          position: row.position,
          school: row.school,
          prop_type: row.prop_type,
          hits: 0,
          total: 0,
          pending: 0,
          hit_rate: 0,
          recent_results: [],
          drafted: row.drafted,
          year: row.year
        };
      }
      trends[key].total += 1;
      if (row.result === 'HIT') trends[key].hits += 1;
      if (row.result === 'PENDING') trends[key].pending += 1;
      trends[key].recent_results.push(row.result);
      trends[key].hit_rate = ((trends[key].hits / (trends[key].total - trends[key].pending)) * 100).toFixed(1);
    });

    // Convert to array and sort
    let result = Object.values(trends);
    
    if (sort === 'hitrate') {
      result.sort((a, b) => parseFloat(b.hit_rate) - parseFloat(a.hit_rate));
    } else if (sort === 'volume') {
      result.sort((a, b) => b.total - a.total);
    }

    return res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });

  } catch (error) {
    console.error('CFB trends API error:', error);
    return res.status(500).json({ error: error.message });
  }
}
