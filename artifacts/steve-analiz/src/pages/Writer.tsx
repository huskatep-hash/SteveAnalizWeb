import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useListApprovedWriters, useApplyAsWriter } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { PenTool, CheckCircle2, UserCircle } from "lucide-react";

const writerFormSchema = z.object({
  name: z.string().min(2, "Ad Soyad en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  bio: z.string().min(20, "Biyografi en az 20 karakter olmalıdır").max(500, "Biyografi en fazla 500 karakter olabilir")
});

type WriterFormValues = z.infer<typeof writerFormSchema>;

export default function Writer() {
  const { data: writers, isLoading: isLoadingWriters } = useListApprovedWriters();
  const applyMutation = useApplyAsWriter();
  const { toast } = useToast();

  const form = useForm<WriterFormValues>({
    resolver: zodResolver(writerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: ""
    }
  });

  const onSubmit = (data: WriterFormValues) => {
    applyMutation.mutate({ data }, {
      onSuccess: () => {
        toast({
          title: "Başvuru Alındı",
          description: "Yazarlık başvurunuz başarıyla tarafımıza ulaştı. Değerlendirme sonrası e-posta ile dönüş yapılacaktır.",
        });
        form.reset();
      },
      onError: () => {
        toast({
          title: "Hata",
          description: "Başvuru gönderilirken bir hata oluştu. Lütfen tekrar deneyin.",
          variant: "destructive"
        });
      }
    });
  };

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
              {isLoadingWriters ? (
                Array.from({ length: 4 }).map((_, i) => (
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
              ) : writers?.length === 0 ? (
                <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed rounded-lg">
                  Henüz onaylı yazar bulunmuyor.
                </div>
              ) : (
                writers?.map((writer) => (
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

        <div className="lg:col-span-1 relative">
          <div className="sticky top-24">
            <Card className="border-primary/20 bg-card/80 backdrop-blur">
              <CardHeader>
                <CardTitle>Yazarlık Başvurusu</CardTitle>
                <CardDescription>
                  Ekibimize katılmak için aşağıdaki formu doldurun. Uzmanlığınızı kanıtlayacak detayları eklemeyi unutmayın.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ad Soyad</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-posta</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Biyografi & Uzmanlık</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Kısaca kendinizden ve finansal analiz tecrübenizden bahsedin..." 
                              className="resize-none min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={applyMutation.isPending}>
                      {applyMutation.isPending ? "Gönderiliyor..." : "Başvuruyu Gönder"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
