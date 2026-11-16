import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Target, Sparkles, Upload, FileText, Briefcase, Loader2, CheckCircle2, XCircle, Copy, Download, Printer, Plus, Check,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { analyze, generateResume, stripMarks, type Analysis } from "@/utils/atsEngine";
import { SAMPLE_JOB, SAMPLE_RESUME, SAMPLE_TITLE } from "@/lib/sample";
import { resumePlainText } from "@/utils/resumeFormatting";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VagaMatch AI — Currículo otimizado para ATS" },
      { name: "description", content: "Analise a compatibilidade do seu currículo com a vaga e gere uma versão otimizada para sistemas ATS." },
      { property: "og:title", content: "VagaMatch AI — Currículo otimizado para ATS" },
      { property: "og:description", content: "Score de aderência, palavras-chave ausentes e currículo ATS pronto para exportar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const STORE = "vagamatch-state-v1";
const STEPS = ["Extraindo palavras-chave...", "Calculando aderência ATS...", "Reestruturando experiências..."];

function Index() {
  const [resume, setResume] = useState("");
  const [title, setTitle] = useState("");
  const [job, setJob] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [reading, setReading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [step, setStep] = useState(-1);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [output, setOutput] = useState("");
  const [highlight, setHighlight] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(STORE) ?? "{}");
      if (s.resume) setResume(s.resume);
      if (s.title) setTitle(s.title);
      if (s.job) setJob(s.job);
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) localStorage.setItem(STORE, JSON.stringify({ resume, title, job }));
  }, [resume, title, job, loaded]);

  const words = useMemo(() => (resume.trim() ? resume.trim().split(/\s+/).length : 0), [resume]);

  const loadSample = () => {
    setResume(SAMPLE_RESUME); setTitle(SAMPLE_TITLE); setJob(SAMPLE_JOB);
    toast.success("Exemplo carregado! Clique em Analisar.");
  };

  const onFile = async (file?: File) => {
    if (!file) return;
    setReading(true);
    try {
      const { readResumeFile } = await import("@/utils/pdfExtractor");
      const text = await readResumeFile(file);
      setResume(text);
      setAnalysis(null); setSelected([]);
      setOutput(generateResume(text, "", { matched: [] }, []));
      toast.success(`"${file.name}" importado e formatado.`);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao ler o arquivo.");
    } finally {
      setReading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const run = async () => {
    if (words < 20) { toast.error("Adicione um currículo com pelo menos 20 palavras."); return; }
    if (job.trim().split(/\s+/).length < 15) { toast.error("Cole a descrição completa da vaga."); return; }
    for (let i = 0; i < STEPS.length; i++) { setStep(i); await new Promise((r) => setTimeout(r, 650)); }
    const a = analyze(resume, title, job);
    setAnalysis(a); setSelected([]);
    setOutput(generateResume(resume, title, a, []));
    setStep(-1);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const toggleSkill = (term: string) => {
    if (!analysis) return;
    const next = selected.includes(term) ? selected.filter((t) => t !== term) : [...selected, term];
    setSelected(next);
    setOutput(generateResume(resume, title, analysis, next));
  };

  const clean = stripMarks(output);
  const copy = async () => {
    try { await navigator.clipboard.writeText(resumePlainText(output)); toast.success("Currículo copiado!"); }
    catch { toast.error("Não foi possível copiar. Baixe o currículo em Word."); }
  };
  const downloadWord = async () => {
    setExporting(true);
    try {
      const { buildResumeDocx } = await import("@/utils/docxExport");
      const blob = await buildResumeDocx(output);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url; link.download = "curriculo-ats.docx"; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast.success("Currículo Word baixado!");
    } catch { toast.error("Não foi possível baixar o Word. Tente novamente."); }
    finally { setExporting(false); }
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([clean], { type: "text/markdown" }));
    const a = document.createElement("a");
    a.href = url; a.download = `curriculo-ats-${(title || "vaga").toLowerCase().replace(/\s+/g, "-")}.md`; a.click();
    URL.revokeObjectURL(url);
  };

  const busy = step >= 0;

  return (
    <div className="min-h-screen bg-surface-soft font-sans text-foreground">
      <header className="no-print sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground"><Target className="h-5 w-5" /></div>
            <span className="text-lg font-extrabold tracking-tight">VagaMatch AI</span>
            <Badge variant="secondary" className="ml-1 hidden sm:inline-flex">Otimizado para ATS</Badge>
          </div>
          <Button variant="outline" onClick={loadSample}><Sparkles className="mr-2 h-4 w-4" />Carregar Exemplo de Teste</Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-10 px-4 py-8">
        <section className="no-print space-y-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Descubra seu match com a vaga e passe pelos robôs de triagem.</h1>
            <p className="mt-2 text-muted-foreground">Cole seu currículo e a descrição da vaga. Calculamos sua aderência e geramos um currículo ATS-friendly em segundos.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" />Seu Currículo Base</CardTitle>
                <CardDescription>Cole o texto ou envie um arquivo .docx, .pdf, .txt ou .md</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <input ref={fileRef} type="file" accept=".docx,.pdf,.txt,.md" aria-label="Importar currículo" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
                <Button variant="secondary" className="w-full" onClick={() => fileRef.current?.click()} disabled={reading}>
                  {reading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                  {reading ? "Lendo arquivo..." : "Importar currículo"}
                </Button>
                <Textarea value={resume} onChange={(e) => setResume(e.target.value)} placeholder="Cole aqui o texto do seu currículo..." className="min-h-[320px]" />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{words} palavras</span>
                  {words >= 20 && <Badge variant="secondary"><Check className="mr-1 h-3 w-3" />Currículo carregado</Badge>}
                </div>
                <Button variant="outline" className="w-full" disabled={!resume.trim() || reading || busy} onClick={() => {
                  setAnalysis(null); setSelected([]);
                  setOutput(generateResume(resume, "", { matched: [] }, []));
                  setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
                }}><FileText className="mr-2 h-4 w-4" />Formatar currículo sem vaga</Button>
              </CardContent>
            </Card>
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5 text-primary" />A Vaga Desejada</CardTitle>
                <CardDescription>Informe o cargo e cole a descrição completa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="title">Título do Cargo</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Analista de Dados Pleno" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="job">Descrição Completa da Vaga</Label>
                  <Textarea id="job" value={job} onChange={(e) => setJob(e.target.value)} placeholder="Requisitos, responsabilidades, diferenciais..." className="min-h-[300px]" />
                </div>
              </CardContent>
            </Card>
          </div>
          <Button size="lg" className="h-14 w-full text-base hover:bg-primary-hover" onClick={run} disabled={busy}>
            {busy ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />{STEPS[step]}</> : <><Sparkles className="mr-2 h-5 w-5" />Analisar Match & Gerar Currículo ATS</>}
          </Button>
        </section>

        {output && (
          <div ref={resultsRef} className="space-y-10">
            {analysis && <section className="no-print space-y-6">
              <h2 className="text-2xl font-bold">Dashboard de Matchmaking</h2>
              <Card className="shadow-soft">
                <CardContent className="grid gap-6 p-6 md:grid-cols-[auto_1fr] md:items-center">
                  <div className="text-center">
                    <div className="text-6xl font-extrabold text-primary">{analysis.score}%</div>
                    <Badge className="mt-2" variant={analysis.score >= 75 ? "default" : analysis.score >= 50 ? "secondary" : "destructive"}>{analysis.level}</Badge>
                  </div>
                  <div className="space-y-3">
                    <Progress value={analysis.score} className="h-3" />
                    <p className="text-muted-foreground">{analysis.summary}</p>
                  </div>
                </CardContent>
              </Card>
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader><CardTitle className="text-base">Palavras-Chave Encontradas ({analysis.matched.length})</CardTitle></CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {analysis.matched.length ? analysis.matched.map((k) => <Badge key={k.term} variant="secondary">{k.term}</Badge>) : <p className="text-sm text-muted-foreground">Nenhuma ainda.</p>}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Palavras-Chave Ausentes ({analysis.missing.length})</CardTitle>
                    <CardDescription>Clique nas habilidades que você realmente possui para incluí-las.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {analysis.missing.map((k) => {
                      const on = selected.includes(k.term);
                      return (
                        <button key={k.term} onClick={() => toggleSkill(k.term)}
                          className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors ${on ? "border-primary bg-primary text-primary-foreground" : "border-dashed border-primary/50 text-accent-foreground hover:bg-accent"}`}>
                          {on ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}{k.term}
                        </button>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader><CardTitle className="text-base">Checklist de Boas Práticas ATS</CardTitle></CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2">
                  {analysis.checklist.map((c) => (
                    <div key={c.label} className="flex gap-3">
                      {c.ok ? <CheckCircle2 className="h-5 w-5 shrink-0 text-success" /> : <XCircle className="h-5 w-5 shrink-0 text-warning" />}
                      <div><p className="font-medium">{c.label}</p><p className="text-sm text-muted-foreground">{c.hint}</p></div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>}

            <section className="space-y-4">
              <div className="no-print flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-bold">Seu Currículo ATS-Friendly</h2>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={copy}><Copy className="mr-2 h-4 w-4" />Copiar Texto Limpo</Button>
                  <Button variant="outline" onClick={download}><Download className="mr-2 h-4 w-4" />Baixar .md</Button>
                  <Button onClick={downloadWord} disabled={exporting}>{exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}Baixar .docx</Button>
                  <Button onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" />Imprimir / PDF</Button>
                </div>
              </div>
              <Tabs defaultValue="preview">
                <div className="no-print flex flex-wrap items-center justify-between gap-3">
                  <TabsList>
                    <TabsTrigger value="preview">Visualização Limpa</TabsTrigger>
                    <TabsTrigger value="edit">Editar & Ajustar Texto</TabsTrigger>
                  </TabsList>
                  <label className="flex items-center gap-2 text-sm">
                    <Switch checked={highlight} onCheckedChange={setHighlight} />Destacar otimizações feitas
                  </label>
                </div>
                <TabsContent value="preview" forceMount className="data-[state=inactive]:hidden print:!block">
                  <div className="print-area resume-sheet mt-4"><ResumePreview md={output} highlight={highlight} /></div>
                </TabsContent>
                <TabsContent value="edit" className="no-print">
                  <Textarea value={output} onChange={(e) => setOutput(e.target.value)} className="mt-2 min-h-[600px] font-mono text-sm" />
                  <p className="mt-2 text-xs text-muted-foreground">Trechos entre ==sinais== são destacados como otimizações e removidos ao exportar.</p>
                </TabsContent>
              </Tabs>
            </section>
          </div>
        )}
        <Separator className="no-print" />
        <footer className="no-print pb-6 text-center text-sm text-muted-foreground">VagaMatch AI · Arquivos são lidos no seu navegador e nada é enviado para fora do seu dispositivo.</footer>
      </main>
    </div>
  );
}

function inline(text: string, hl: boolean): ReactNode[] {
  return text.split(/(==.+?==)/g).map((part, i) =>
    part.startsWith("==") && part.endsWith("==") ? (
      hl ? <mark key={i} className="rounded bg-highlight px-0.5 text-accent-foreground underline decoration-primary/40">{part.slice(2, -2)}</mark> : <span key={i}>{part.slice(2, -2)}</span>
    ) : <span key={i}>{part}</span>,
  );
}

function ResumePreview({ md, highlight }: { md: string; highlight: boolean }) {
  const blocks: ReactNode[] = [];
  let bullets: string[] = [];
  const flush = () => {
    if (bullets.length) blocks.push(<ul key={`u${blocks.length}`} className="mb-3 list-disc space-y-1 pl-5">{bullets.map((b, i) => <li key={i}>{inline(b, highlight)}</li>)}</ul>);
    bullets = [];
  };
  md.split("\n").forEach((line, i) => {
    if (line.startsWith("- ")) { bullets.push(line.slice(2)); return; }
    flush();
    if (line.startsWith("# ")) blocks.push(<h1 key={i} className="text-2xl font-bold">{inline(line.slice(2), highlight)}</h1>);
    else if (line.startsWith("## ")) blocks.push(<h2 key={i} className="mb-2 mt-5 border-b border-border pb-1 text-sm font-bold uppercase tracking-wider">{inline(line.slice(3), highlight)}</h2>);
    else if (line.startsWith("### ")) blocks.push(<h3 key={i} className="mb-1 mt-3 font-semibold">{inline(line.slice(4), highlight)}</h3>);
    else if (line.trim()) blocks.push(<p key={i} className="mb-1 leading-relaxed">{inline(line, highlight)}</p>);
  });
  flush();
  return <article className="text-sm text-foreground">{blocks}</article>;
}
