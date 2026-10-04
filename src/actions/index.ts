import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro:schema';
import { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM } from 'astro:env/server';
import { Resend } from 'resend';

const escape = (s = '') =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export const server = {
  contact: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string().trim().min(2, 'Indica tu nombre.').max(100),
      email: z.string().trim().email('El email no es válido.'),
      phone: z.string().trim().max(30).optional(),
      company: z.string().trim().max(120).optional(),
      projectType: z.string().min(1, 'Elige un tipo de proyecto.'),
      budget: z.string().optional(),
      message: z.string().trim().min(10, 'Cuéntanos un poco más (mín. 10 caracteres).').max(5000),
      consent: z.boolean().refine((v) => v, 'Debes aceptar la política de privacidad.'),
      website: z.string().optional(), // honeypot
    }),
    handler: async (input) => {
      // Si un bot rellena el honeypot, fingimos éxito y no enviamos nada
      if (input.website) return { ok: true };

      const rows: [string, string | undefined][] = [
        ['Nombre', input.name],
        ['Email', input.email],
        ['Teléfono', input.phone],
        ['Empresa', input.company],
        ['Tipo de proyecto', input.projectType],
        ['Presupuesto', input.budget],
      ];
      const html = `
        <h2>Nuevo lead desde lionbyte</h2>
        <table cellpadding="6">${rows
          .filter(([, v]) => v)
          .map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escape(v)}</td></tr>`)
          .join('')}</table>
        <p><strong>Mensaje:</strong></p>
        <p style="white-space:pre-wrap">${escape(input.message)}</p>`;

      if (!RESEND_API_KEY || !CONTACT_TO) {
        // Modo desarrollo sin claves: mostramos el lead en la consola
        console.log('[contact] Lead recibido (configura RESEND_API_KEY y CONTACT_TO para enviarlo por email):', input);
        return { ok: true };
      }

      const resend = new Resend(RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from: CONTACT_FROM,
        to: CONTACT_TO,
        replyTo: input.email,
        subject: `Nuevo lead: ${input.name} · ${input.projectType}`,
        html,
      });

      if (error) {
        console.error('[contact] Error de Resend:', error);
        throw new ActionError({ code: 'INTERNAL_SERVER_ERROR', message: 'No se pudo enviar el mensaje.' });
      }
      return { ok: true };
    },
  }),
};
