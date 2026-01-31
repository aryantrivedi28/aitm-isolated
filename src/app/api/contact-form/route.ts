// app/api/contact-form/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { FormData } from '../../../types/form';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);


// Helper to get IP and User Agent for tracking
const getClientInfo = (request: NextRequest) => {
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  return { ip, userAgent };
};

export async function POST(request: NextRequest) {
  try {
    const body: FormData = await request.json();
    const { ip, userAgent } = getClientInfo(request);
    
    // Validation - only check the fields we need
    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Phone validation (basic)
    const phoneRegex = /^[\+]?[1-9][\d\-\(\)\.\s]*$/;
    if (!phoneRegex.test(body.phone.replace(/\s/g, ''))) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // For other form fields not in this form, we'll set default values or null
    const submissionData = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      website: body.website || null,
      // For fields not in this form, set default/empty values
      business: null, // Not in this form
      interest: 'Services Consultation', // Default value since this form is about services
      services: body.services, // Store as JSONB
      selected_services: body.services.map(s => s.category), // Store as array for easier querying
      ip_address: ip,
      user_agent: userAgent,
      status: 'new',
      submitted_at: new Date().toISOString()
    };

    // Save to Supabase using your existing table
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([submissionData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save form data' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Form submitted successfully', 
        data: data,
        id: data.id 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}