import { Link } from "wouter";
import { useListApprovedWriters } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PenTool, CheckCircle2, UserCircle } from "lucide-react";

const MOCK_WRITERS = [
  { id: 1, name: "Ahmet Yılmaz", email: "ahmet@ornek.com", bio: "Finansal analist, 10 yıl deneyim.", status: "approved" },
  { id: 2, name: "Ayşe Demir", email: "ayse@ornek.com", bio: "Ekonomi yorumcusu ve blog yazarı.", status: "approved" }
];

export default function Writer() {
  const { data: writers, isLoading } = useListApprovedWriters();
  const safeWriters = Array.isArray(writers) && writers.length > 0 ? writers : MOCK_WRITERS;

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <section className="py-12 border-b border-border/40">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center justify-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-2">
            <PenTool className="mr-2 h-4 w-4" />
            Yazar Ekosistemi
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            Analist Ağına Katılın
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Piyasaları yorumlayın, içgörülerinizi geniş bir kitleyle paylaşın ve Steve Analiz topluluğunun güvenilir bir sesi olun.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-6">Onaylı Yazarlar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {isLoading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-16 w-full" />
                    </CardContent>
                  </Card>
                ))
              ) : (
                safeWriters.map((writer) => (
                  <Card key={writer.id} className="bg-card/50 border-border/50">
                    <CardHeader className="flex flex-row items-start gap-4 pb-2">
                      <UserCircle className="h-12 w-12 text-primary/60" />
                      <div>
                        <CardTitle className="text-lg">{writer.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1 flex items-center w-fit text-[10px]">
                          <CheckCircle2 className="mr-1 h-3 w-3 text-green-500" /> Onaylı
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {writer.bio}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
