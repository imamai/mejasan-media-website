export interface WeddingQuestionnaireData {
  bride_name: string;
  groom_name: string;
  wedding_date: string;
  theme_colors: string;
  wedding_theme: string;
  bride_prep_location: string;
  groom_prep_location: string;
  ceremony_venue: string;
  reception_venue: string;
  bride_prep_time: string;
  groom_prep_time: string;
  ceremony_time: string;
  reception_time: string;
  end_time: string;
  photo_style: string;
  video_style: string;
  style_references: string;
  style_avoid: string;
  bride_parents: string;
  groom_parents: string;
  best_man: string;
  maid_of_honour: string;
  vip_guests: string;
  family_groupings: string;
  highlight_length: string;
  documentary_edit: string;
  pa_system: string;
  sound_contact: string;
  live_performances: string;
  planner_name: string;
  planner_contact: string;
  mc_name: string;
  mc_contact: string;
  church_coord_name: string;
  church_coord_contact: string;
  venue_manager_name: string;
  venue_manager_contact: string;
  how_you_met: string;
  proposal_story: string;
  special_songs: string;
  surprises: string;
  selected_package: string;
  additional_services: string;
  delivery_timeline: string;
  client_email: string;
}

export interface WeddingContractData {
  event_type: string;
  event_date: string;
  location: string;
  cost: string;
  client_name: string;
  client_phone: string;
  media_consent: string;
  quote_ref?: string;
  sig_client_name: string;
  sig_client_date: string;
  sig_witness_name: string;
  sig_witness_date: string;
  sig_company_name: string;
  sig_company_date: string;
  sig_compwit_name: string;
  sig_compwit_date: string;
}

export interface WeddingContractSignatures {
  client?: string | null;
  witness?: string | null;
  company?: string | null;
  companyWitness?: string | null;
}
