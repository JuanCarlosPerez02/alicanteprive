import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad — Alicante Privé',
};

export default function PoliticaPrivacidadPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-10">
        <p className="text-gold text-xs tracking-[0.3em] uppercase font-sans mb-2">
          Alicante Privé
        </p>
        <h1 className="font-heading text-3xl md:text-4xl font-semibold">Política de Privacidad</h1>
        <p className="text-muted-foreground mt-3 text-sm">Última actualización: junio de 2025</p>
      </div>

      <div className="prose prose-sm max-w-none text-foreground space-y-8">
        <section>
          <h2 className="font-heading text-lg font-semibold mb-3">1. Responsable del tratamiento</h2>
          <p className="text-muted-foreground leading-relaxed">
            En cumplimiento del Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD),
            le informamos que los datos personales recabados a través de este sitio web son tratados por:
          </p>
          <ul className="mt-3 space-y-1 text-muted-foreground">
            <li><strong className="text-foreground">Denominación:</strong> Alicante Privé</li>
            <li><strong className="text-foreground">Dirección:</strong> C. Alvarez Sereix 11, Entreplanta derecha, 03001 Alicante</li>
            <li><strong className="text-foreground">Email:</strong>{' '}
              <a href="mailto:info@alicanteprive.com" className="hover:text-gold transition-colors underline">
                info@alicanteprive.com
              </a>
            </li>
            <li><strong className="text-foreground">Teléfono:</strong>{' '}
              <a href="tel:+34603248668" className="hover:text-gold transition-colors underline">
                +34 603 248 668
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold mb-3">2. Finalidad del tratamiento</h2>
          <p className="text-muted-foreground leading-relaxed">
            Los datos personales que nos facilite a través del formulario de contacto serán tratados con las
            siguientes finalidades:
          </p>
          <ul className="mt-3 space-y-1 text-muted-foreground list-disc list-inside">
            <li>Atender y responder a su solicitud de información.</li>
            <li>Gestionar la relación comercial derivada del interés en nuestras propiedades.</li>
            <li>Enviarle información sobre propiedades y servicios similares, siempre que haya prestado su consentimiento.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold mb-3">3. Base jurídica</h2>
          <p className="text-muted-foreground leading-relaxed">
            El tratamiento de sus datos se basa en el consentimiento que usted nos otorga al marcar la casilla
            de aceptación en el formulario de contacto (art. 6.1.a RGPD), así como en el interés legítimo
            de responder a las consultas recibidas (art. 6.1.f RGPD).
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold mb-3">4. Conservación de los datos</h2>
          <p className="text-muted-foreground leading-relaxed">
            Sus datos se conservarán durante el tiempo necesario para atender su solicitud y, en su caso,
            mientras se mantenga la relación comercial. Una vez finalizada, se conservarán bloqueados durante
            los plazos legalmente exigibles.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold mb-3">5. Destinatarios</h2>
          <p className="text-muted-foreground leading-relaxed">
            Sus datos no serán cedidos a terceros salvo obligación legal. Para la prestación del servicio
            podemos contar con proveedores de servicios tecnológicos (alojamiento web, herramientas de gestión)
            que actúan como encargados del tratamiento bajo los acuerdos exigidos por la normativa.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold mb-3">6. Sus derechos</h2>
          <p className="text-muted-foreground leading-relaxed">
            Puede ejercitar en cualquier momento los siguientes derechos:
          </p>
          <ul className="mt-3 space-y-1 text-muted-foreground list-disc list-inside">
            <li><strong className="text-foreground">Acceso:</strong> conocer qué datos tenemos sobre usted.</li>
            <li><strong className="text-foreground">Rectificación:</strong> corregir datos inexactos.</li>
            <li><strong className="text-foreground">Supresión:</strong> solicitar la eliminación de sus datos.</li>
            <li><strong className="text-foreground">Oposición y limitación:</strong> limitar u oponerse al tratamiento.</li>
            <li><strong className="text-foreground">Portabilidad:</strong> recibir sus datos en formato estructurado.</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Para ejercer estos derechos, diríjase a{' '}
            <a href="mailto:info@alicanteprive.com" className="hover:text-gold transition-colors underline">
              info@alicanteprive.com
            </a>{' '}
            indicando su nombre, apellidos y derecho que desea ejercitar. También puede reclamar ante la
            Agencia Española de Protección de Datos (<a href="https://www.aepd.es" target="_blank" rel="noreferrer" className="hover:text-gold transition-colors underline">www.aepd.es</a>).
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold mb-3">7. Seguridad</h2>
          <p className="text-muted-foreground leading-relaxed">
            Hemos adoptado las medidas técnicas y organizativas necesarias para garantizar la seguridad
            e integridad de los datos personales que tratamos, así como para evitar su pérdida, alteración
            y/o acceso por parte de terceros no autorizados.
          </p>
        </section>
      </div>
    </div>
  );
}
