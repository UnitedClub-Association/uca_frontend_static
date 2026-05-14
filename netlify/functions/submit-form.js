const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
  },
});

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const { registration_type } = data;
    
    let query = '';
    let values = [];

    // Route 1: Individual
    if (registration_type === 'individual') {
      query = `
        INSERT INTO uca_individual_members 
        (name_en, name_bn, father_en, father_bn, mother_en, mother_bn, phone, email, institute, class_year, social_links, reason, comments) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
        RETURNING id;
      `;
      values = [
        data.ind_name_en, data.ind_name_bn, 
        data.ind_father_en, data.ind_father_bn, 
        data.ind_mother_en, data.ind_mother_bn, 
        data.ind_phone, data.ind_email, 
        data.ind_institute, data.ind_class, 
        data.ind_social || null, data.ind_reason, data.ind_comments || null
      ];
    } 
    // Route 2: Club
    else if (registration_type === 'club') {
      query = `
        INSERT INTO uca_club_affiliations 
        (name_en, name_bn, acronym, institute, institute_level, exec1_en, exec1_bn, exec2_en, exec2_bn, exec3_en, exec3_bn, email, phone1, phone2, phone3, reason, comments) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) 
        RETURNING id;
      `;
      values = [
        data.club_name_en, data.club_name_bn, data.club_acronym || null, 
        data.club_institute, data.club_level,
        data.club_exec1_en, data.club_exec1_bn, 
        data.club_exec2_en || null, data.club_exec2_bn || null, 
        data.club_exec3_en || null, data.club_exec3_bn || null, 
        data.club_email, data.club_phone1, 
        data.club_phone2 || null, data.club_phone3 || null, 
        data.club_reason, data.club_comments || null
      ];
    } 
    // Route 3: Corporate
    else if (registration_type === 'corporate') {
      query = `
        INSERT INTO uca_corporate_sponsors 
        (name_en, name_bn, acronym, industry_type, website, email, phone, reason, comments) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING id;
      `;
      values = [
        data.corp_name_en, data.corp_name_bn, data.corp_acronym || null,
        data.corp_type, data.corp_website, 
        data.corp_email, data.corp_phone, 
        data.corp_reason, data.corp_comments || null
      ];
    } else {
      throw new Error("Invalid registration type");
    }

    const result = await pool.query(query, values);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Registration successful', 
        id: result.rows[0].id 
      }),
    };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};