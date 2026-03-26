-- Snifr Waiting List Database Schema
-- Run this in your Neon DB SQL editor to create the waiting_list table

-- Create waiting_list table
CREATE TABLE IF NOT EXISTS waiting_list (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'pending',
    source VARCHAR(100) DEFAULT 'website',
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_waiting_list_email ON waiting_list(email);

-- Create index on subscribed_at for analytics
CREATE INDEX IF NOT EXISTS idx_waiting_list_subscribed_at ON waiting_list(subscribed_at DESC);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_waiting_list_status ON waiting_list(status);

-- Add comment to table
COMMENT ON TABLE waiting_list IS 'Stores email addresses of users waiting for Snifr launch';
COMMENT ON COLUMN waiting_list.status IS 'pending: awaiting launch, notified: email sent, bounced: email bounced, unsubscribed: user opted out';
