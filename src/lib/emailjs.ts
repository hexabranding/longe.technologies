import emailjs from "@emailjs/browser";

export interface ContactEnquiryParams {
  name: string;
  phone: string;
  email: string;
  branch?: string;
  service?: string;
  message: string;
}

export interface JobApplicationParams {
  name: string;
  phone: string;
  email: string;
  position: string;
  experience: string;
  resumeFileName?: string;
  resumeFileSize?: string;
}

export const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_fernkkj",
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_v8w0p79",
  careersTemplateId: import.meta.env.VITE_EMAILJS_CAREERS_TEMPLATE_ID || import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_v8w0p79",
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "Lx0T0urVEC0RxUU43",
  companyEmail: "longetechnologies@outlook.com",
};

export async function sendEnquiryEmail(params: ContactEnquiryParams) {
  const { serviceId, templateId, publicKey, companyEmail } = EMAILJS_CONFIG;

  if (!serviceId || !templateId || !publicKey) {
    throw new Error(
      "EmailJS is not fully configured. Please provide VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY in your .env file."
    );
  }

  const templateParams = {
    // Subject / Title
    title: `${params.service || "Service Enquiry"} - ${params.name}`,
    subject: `Service Enquiry: ${params.service || "General"} - ${params.name}`,

    // Customer Name variations
    name: params.name,
    from_name: params.name,
    customer_name: params.name,
    customers_name: params.name,
    
    // Customer Phone variations
    phone: params.phone,
    customer_phone: params.phone,
    customers_phone: params.phone,
    
    // Customer Email variations
    email: params.email,
    from_email: params.email,
    customer_email: params.email,
    customers_email: params.email,
    reply_to: params.email,
    
    // Service Center / Branch variations
    branch: params.branch || "Kozhikode (Head Office)",
    service_center: params.branch || "Kozhikode (Head Office)",
    
    // Service variations
    service: params.service || "General Consultation",
    service_needed: params.service || "General Consultation",
    
    // Message
    message: params.message,
    
    // Target recipient details
    to_email: companyEmail,
    company_email: companyEmail,
  };

  return emailjs.send(serviceId, templateId, templateParams, {
    publicKey,
  });
}

export async function sendJobApplicationEmail(params: JobApplicationParams) {
  const { serviceId, careersTemplateId, publicKey, companyEmail } = EMAILJS_CONFIG;

  if (!serviceId || !careersTemplateId || !publicKey) {
    throw new Error(
      "EmailJS is not fully configured. Please provide VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY in your .env file."
    );
  }

  const formattedMessage = [
    `NEW JOB APPLICATION RECEIVED`,
    `========================================`,
    `Role Applied For:  ${params.position}`,
    `Candidate Name:    ${params.name}`,
    `Contact Phone:     ${params.phone}`,
    `Email Address:     ${params.email}`,
    `Experience:        ${params.experience}`,
    params.resumeFileName ? `Resume Uploaded:   ${params.resumeFileName}${params.resumeFileSize ? ` (${params.resumeFileSize})` : ""}` : `Resume: Not attached`,
    `========================================`,
    `Submitted from Longe Technologies Careers Portal`,
  ].join("\n");

  const templateParams = {
    // Subject / Title
    title: `Job Application: ${params.position} - ${params.name}`,
    subject: `New Job Application: ${params.position} - ${params.name}`,

    // Candidate details
    name: params.name,
    from_name: params.name,
    customer_name: params.name,
    applicant_name: params.name,

    // Candidate contact
    phone: params.phone,
    customer_phone: params.phone,
    applicant_phone: params.phone,

    email: params.email,
    from_email: params.email,
    customer_email: params.email,
    applicant_email: params.email,
    reply_to: params.email,

    // Service Center / Branch
    branch: "Careers & HR Desk (Kozhikode)",
    service_center: "Careers & HR Desk (Kozhikode)",

    // Job position & service variations
    position: params.position,
    job_position: params.position,
    job_title: params.position,
    service: `Job Application (${params.position})`,
    service_needed: `Job Application (${params.position})`,

    // Experience & Resume
    experience: params.experience,
    applicant_experience: params.experience,
    resume_name: params.resumeFileName || "Uploaded",
    resume_file: params.resumeFileName || "Uploaded",
    resume_size: params.resumeFileSize || "",

    // Formatted full message
    message: formattedMessage,

    // Target recipient details
    to_email: companyEmail,
    company_email: companyEmail,
  };

  return emailjs.send(serviceId, careersTemplateId, templateParams, {
    publicKey,
  });
}


