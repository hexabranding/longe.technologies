import { CheckCircle2, Wrench, Cpu, Award, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface JobDetailsData {
  title: string;
  desc: string;
  tags: string[];
  skillsTitle?: string;
  summaryPoints?: string[];
  responsibilities: string[];
  technicalSkills: string[];
  hardwareSkills?: string[];
  hardwareSkillsTitle?: string;
  requirements: string[];
}

export function JobDetailsDialog({
  open,
  onOpenChange,
  job,
  onApply,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  job: JobDetailsData | null;
  onApply: () => void;
}) {
  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl p-6 sm:p-8">
        <DialogHeader className="border-b pb-5">
          <div className="flex flex-wrap gap-2 mb-2">
            {job.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-accent px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-accent-foreground"
              >
                {t}
              </span>
            ))}
          </div>
          <DialogTitle className="font-display text-2xl sm:text-3xl font-bold text-navy">
            {job.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            {job.desc}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-3">
          {/* Key Responsibilities */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                <Wrench className="size-4" />
              </span>
              <h4 className="font-display text-base font-bold text-navy">Key Responsibilities</h4>
            </div>
            <ul className="grid gap-2 sm:grid-cols-2 text-xs sm:text-sm text-navy/80">
              {job.responsibilities.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technical Skills */}
          <div className="rounded-2xl border bg-accent/40 p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                <Cpu className="size-4" />
              </span>
              <h4 className="font-display text-base font-bold text-navy">
                {job.skillsTitle || "Required Core & Technical Skills"}
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {job.technicalSkills.map((s, i) => (
                <span
                  key={i}
                  className="rounded-lg border border-border/80 bg-background px-2.5 py-1 text-xs font-semibold text-navy shadow-2xs"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Secondary / Domain Skills (if available) */}
          {job.hardwareSkills && job.hardwareSkills.length > 0 && (
            <div>
              <h4 className="font-display text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
                {job.hardwareSkillsTitle || "Specialized Knowledge & Tools"}
              </h4>
              <div className="flex flex-wrap gap-2">
                {job.hardwareSkills.map((h, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-navy/80"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Candidate Requirements */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="grid size-8 place-items-center rounded-lg bg-success/15 text-success">
                <Award className="size-4" />
              </span>
              <h4 className="font-display text-base font-bold text-navy">Candidate Requirements</h4>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-navy/80">
              {job.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="size-1.5 rounded-full bg-primary shrink-0 mt-2" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            variant="hero"
            onClick={() => {
              onOpenChange(false);
              onApply();
            }}
          >
            Apply for this Position <ArrowRight />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

