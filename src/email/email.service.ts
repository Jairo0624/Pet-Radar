import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private readonly configService: ConfigService) {
    // Las  credenciales del .env
    this.transporter = nodemailer.createTransport({
      service: this.configService.get<string>('MAILER_SERVICE'),
      auth: {
        user: this.configService.get<string>('MAILER_EMAIL'),
        pass: this.configService.get<string>('MAILER_PASSWORD'),
      },
    });
  }

  async sendMatchNotification(
    ownerEmail: string,
    lostPet: any,
    foundPet: any,
    distanceInMeters: number,
    lostLon: number,
    lostLat: number,
    foundLon: number,
    foundLat: number
  ) {
    const mapboxToken = this.configService.get<string>('MAPBOX_TOKEN');
    
    // Cambios en el mapa: Pines grandes (pin-l), colores hexadecimales, resolución 800x400 y @2x para mayor nitidez
    const mapboxUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-l-l+e74c3c(${lostLon},${lostLat}),pin-l-f+2ecc71(${foundLon},${foundLat})/auto/800x400@2x?access_token=${mapboxToken}`;

    const mailOptions = {
      from: `"PetRadar 🐾" <${this.configService.get('MAILER_EMAIL')}>`,
      to: ownerEmail,
      subject: `¡Tenemos pistas sobre ${lostPet.name}! 🚨`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
          
          <div style="background-color: #f39c12; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">¡Posible Coincidencia! 🐾</h1>
          </div>
          
          <div style="padding: 25px; background-color: #ffffff; color: #333333;">
            <p style="font-size: 16px; line-height: 1.5;">Hola, tenemos excelentes noticias. Alguien acaba de reportar una mascota muy parecida a <b>${lostPet.name}</b> a tan solo <b style="color: #d35400;">${Math.round(distanceInMeters)} metros</b> de tu ubicación original.</p>
            
            <div style="background-color: #fdf2e9; padding: 15px; border-left: 4px solid #e67e22; border-radius: 4px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #d35400;">📝 Datos de la mascota encontrada:</h3>
              <p style="margin: 5px 0;"><b>Especie:</b> ${foundPet.species} ${foundPet.breed ? `(${foundPet.breed})` : ''}</p>
              <p style="margin: 5px 0;"><b>Color:</b> ${foundPet.color}</p>
              <p style="margin: 5px 0;"><b>Descripción:</b> ${foundPet.description}</p>
            </div>

            <div style="background-color: #eafaf1; padding: 15px; border-left: 4px solid #2ecc71; border-radius: 4px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #27ae60;">👤 Contacto de quien lo encontró:</h3>
              <p style="margin: 5px 0;"><b>Nombre:</b> ${foundPet.finderName}</p>
              <p style="margin: 5px 0;"><b>Teléfono:</b> <a href="tel:${foundPet.finderPhone}" style="color: #2980b9; text-decoration: none;"><b>${foundPet.finderPhone}</b></a></p>
              <p style="margin: 5px 0;"><b>Email:</b> <a href="mailto:${foundPet.finderEmail}" style="color: #2980b9; text-decoration: none;"><b>${foundPet.finderEmail}</b></a></p>
            </div>

            <h3 style="text-align: center; color: #333; margin-top: 30px;">📍 Ubicación del hallazgo</h3>
            <p style="text-align: center; font-size: 13px; color: #777; margin-bottom: 10px;">🔴 Pin rojo: Extravío &nbsp; | &nbsp; 🟢 Pin verde: Hallazgo</p>
            <img src="${mapboxUrl}" alt="Mapa de coincidencia" style="width: 100%; border-radius: 8px; border: 1px solid #ccc; display: block; margin: 0 auto;" />
          </div>

          <div style="background-color: #f8f9fa; text-align: center; padding: 15px; font-size: 12px; color: #888;">
            © 2026 PetRadar - Conectando peludos con sus familias en tiempo récord.
          </div>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}