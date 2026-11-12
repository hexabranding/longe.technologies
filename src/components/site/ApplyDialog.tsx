import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Upload, Send, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { sendJobApplicationEmail, EMAILJS_CONFIG } from "@/lib/emailjs";

export const POSITIONS = ["Laptop Service Engineer", "Service Coordinator"] as const;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z.string().trim().regex(/^[+\d\s-]{7,15}$/, "Enter a valid phone number"),
  email: z.string().trim().email("Enter a valid email").max(255),
  position: z.enum(POSITIONS),
  experience: z.string().trim().min(1, "Select your experience"),
});

export function ApplyDialog({
  open,
  onOpenChange,
  position,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  position: (typeof POSITIONS)[number];
}) {
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const res = schema.safeParse(data);
    const errs: Record<string, string> = {};
    if (!res.success) res.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
    if (!file) errs["resume"] = "Please upload your resume";
    else if (file.size > 5 * 1024 * 1024) errs["resume"] = "Resume must be under 5 MB";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setIsSubmitting(true);

    const payload = {
      name: res.data.name,
      phone: res.data.phone,
      email: res.data.email,
      position: res.data.position,
      experience: res.data.experience,
      resumeFileName: file.name,
      resumeFileSize: formatFileSize(file.size),
    };

    try {
      if (!EMAILJS_CONFIG.serviceId || !EMAILJS_CONFIG.templateId || !EMAILJS_CONFIG.publicKey) {
        // Fallback mailto if EmailJS credentials are not present
        const mailSubject = encodeURIComponent(`Job Application: ${payload.position} - ${payload.name}`);
        const mailBody = encodeURIComponent(
          `Candidate Application Details:\n` +
          `==============================\n` +
          `Position Applied: ${payload.position}\n` +
          `Candidate Name:   ${payload.name}\n` +
          `Phone Number:     ${payload.phone}\n` +
          `Email Address:    ${payload.email}\n` +
          `Experience Level: ${payload.experience}\n` +
          `Resume File:      ${payload.resumeFileName} (${payload.resumeFileSize})\n` +
          `==============================\n` +
          `Please attach your resume (${payload.resumeFileName}) before sending.`
        );
        window.open(`mailto:${EMAILJS_CONFIG.companyEmail}?subject=${mailSubject}&body=${mailBody}`, "_blank");

        toast.success("Application drafted to HR!", {
          description: `An email to ${EMAILJS_CONFIG.companyEmail} has been opened with candidate details.`,
        });
        setFile(null);
        onOpenChange(false);
        return;
      }

      await sendJobApplicationEmail(payload);

      toast.success("Application submitted successfully!", {
        description: `Full details sent to ${EMAILJS_CONFIG.companyEmail}. Our HR team will contact you shortly.`,
      });
      setFile(null);
      setErrors({});
      onOpenChange(false);
    } catch (err: unknown) {
      console.error("Failed to submit job application via EmailJS:", err);
      toast.error("Failed to send application via EmailJS", {
        description: `Please check your connection or email your resume directly to ${EMAILJS_CONFIG.companyEmail}.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const field = "space-y-1.5";
  const err = (k: string) => errors[k] && <p className="text-xs text-destructive">{errors[k]}</p>;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Apply for this role</DialogTitle>
          <DialogDescription>Join the Longe Technologies service team.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2" key={position}>
          {position === "Laptop Service Engineer" && (
            <div className="sm:col-span-2 rounded-xl bg-primary/10 border border-primary/20 p-3 text-xs text-navy font-medium">
              ⚡ <strong>Requirement:</strong> Practical chip-level motherboard repair experience (2–5 years preferred).
            </div>
          )}
          {position === "Service Coordinator" && (
            <div className="sm:col-span-2 rounded-xl bg-primary/10 border border-primary/20 p-3 text-xs text-navy font-medium">
              ⚡ <strong>Requirement:</strong> Planning, site coordination, reporting, and client communication experience.
            </div>
          )}
          <div className={`${field} sm:col-span-2`}>
            <Label htmlFor="a-name">Full name</Label>
            <Input id="a-name" name="name" maxLength={100} placeholder="Your name" />
            {err("name")}
          </div>
          <div className={field}>
            <Label htmlFor="a-phone">Phone</Label>
            <Input id="a-phone" name="phone" maxLength={15} placeholder="+91 98765 43210" />
            {err("phone")}
          </div>
          <div className={field}>
            <Label htmlFor="a-email">Email</Label>
            <Input id="a-email" name="email" type="email" maxLength={255} placeholder="you@email.com" />
            {err("email")}
          </div>
          <div className={field}>
            <Label htmlFor="a-pos">Position</Label>
            <select id="a-pos" name="position" defaultValue={position} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              {POSITIONS.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div className={field}>
            <Label htmlFor="a-exp">Experience</Label>
            <select id="a-exp" name="experience" defaultValue="" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="" disabled>Select experience</option>
              <option>Fresher</option>
              <option>1–2 years</option>
              <option>2–5 years (Recommended for Engineer)</option>
              <option>5+ years</option>
            </select>
            {err("experience")}
          </div>
          <div className={`${field} sm:col-span-2`}>
            <Label htmlFor="a-resume">Resume (PDF/DOC, max 5 MB)</Label>
            <label htmlFor="a-resume" className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-input bg-secondary px-4 py-5 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary">
              <Upload className="size-5" />
              <span className="truncate">{file ? file.name : "Click to upload your resume"}</span>
            </label>
            <input id="a-resume" type="file" accept=".pdf,.doc,.docx" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            {err("resume")}
          </div>
          <Button type="submit" variant="hero" size="lg" className="sm:col-span-2" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin shrink-0" /> Submitting Application...
              </>
            ) : (
              <>
                Submit Application <Send className="size-4 shrink-0" />
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
