import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PenTool, CheckCircle2, UserCircle } from "lucide-react";
import { useState } from "react";

const MOCK_WRITERS = [
  { id: 1, name: "Ahmet Yılmaz", bio: "Finansal analist, 10 yıl deneyim.", email: "ahmet@ornek.com" },
  { id: 2, name: "Ayşe Demir", bio: "Ekonomi yorumcusu ve blog yazarı.", email: "ayse@ornek.com" },
  { id: 3, name: "Mehmet Kaya", bio: "Kripto para ve blockchain uzmanı.", email: "mehmet@ornek.com" }
];

export default function Writer() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="space-y-16 animate-in fade-in duration-700 pb-20">
      <section className="py-12 border-b border-border/40">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <PenTool className="mr-2 h-4 w-4" /> Yazar Ekosistemi
          </div>
          <h1 className="text-4xl font-extrabold">Analist Ağına Katılın</h1>
          <p className="text-xl text-muted-foreground">Piyasaları yorumlayın, içgörülerinizi geniş bir kitleyle paylaşın.</p>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Onaylı Yazarlar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {MOCK_WRITERS.map(writer => (
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
                  <p className="text-sm text-muted-foreground line-clamp-3">{writer.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="border-primary/20 bg-card/80 backdrop-blur sticky top-24">
            <CardHeader>
              <CardTitle>Yazarlık Başvurusu</CardTitle>
              <CardDescription>Formu doldurun, değerlendirme sonrası dönüş yapalım.</CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-6 text-green-500 font-medium">✅ Başvurunuz alındı!</div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                  <Input placeholder="Ad Soyad" required />
                  <Input type="email" placeholder="E-posta" required />
                  <Textarea placeholder="Biyografi & Uzmanlık" className="resize-none min-h-[120px]" required />
                  <Button type="submit" className="w-full">Başvuruyu Gönder</Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
