
CREATE TABLE public.pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  page_type TEXT NOT NULL DEFAULT 'static',
  seo_title TEXT,
  meta_description TEXT,
  h1 TEXT,
  featured_image TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pages are publicly readable" ON public.pages FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can manage pages" ON public.pages FOR ALL TO authenticated USING (true) WITH CHECK (true);
