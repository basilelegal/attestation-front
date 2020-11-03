import { PDFDocument, StandardFonts } from 'pdf-lib'
import pdfBase from '../assets/certificate.pdf'
import QRCode from 'qrcode'

export const defaultReasons = [
{
    label: 'Travail',
    code: 'travail',
    pos: 578,
  },
  {
    label: 'Courses',
    code: 'achats',
    pos: 533,
  },
  {
    label: 'Santé',
    code: 'sante',
    pos: 477,
  },
  {
    label: 'Famille',
    code: 'famille',
    pos: 435,
  },
  {
    label: 'Balade',
    code: 'sport_animaux',
    pos: 358,
  },
  {
    label: 'Mioche',
    code: 'enfants',
    pos: 211,
  },
  {
    label: 'Acheter des carrottes',
    code: 'achat_de_carrottes',
    pos: 533
  }
]

export function generateQR (text) {
  const opts = {
    errorCorrectionLevel: 'M',
    type: 'image/png',
    quality: 0.92,
    margin: 1,
  }
  return QRCode.toDataURL(text, opts)
}

export async function generatePdf (profile, times, reasons) {
  const {
    lastname,
    firstname,
    birthdate,
    birthplace,
    address,
    zipcode,
    city,
  } = profile
  console.log(times)
  const {
    dateFormatted,
    time,
    creationDateFormatted,
    creationTime
  } = times

  console.log(times)

  const data = [
    `Cree le: ${creationDateFormatted} a ${creationTime}`,
    `Nom: ${lastname}`,
    `Prenom: ${firstname}`,
    `Naissance: ${birthdate} a ${birthplace}`,
    `Adresse: ${address} ${zipcode} ${city}`,
    `Sortie: ${dateFormatted} a ${time}`,
    `Motifs: ${reasons.map(r => r.code).join(', ')}`,
  ].join(';\n ')

  const existingPdfBytes = await fetch(pdfBase).then((res) => {
    return res.arrayBuffer()
  })

  const pdfDoc = await PDFDocument.load(existingPdfBytes)

  // set pdf metadata
  pdfDoc.setTitle('COVID-19 - Déclaration de déplacement')
  pdfDoc.setSubject('Attestation de déplacement dérogatoire')
  pdfDoc.setKeywords([
    'covid19',
    'covid-19',
    'attestation',
    'déclaration',
    'déplacement',
    'officielle',
    'gouvernement',
  ])
  pdfDoc.setProducer('DNUM/SDIT')
  pdfDoc.setCreator('')
  pdfDoc.setAuthor("Ministère de l'intérieur")

  const page1 = pdfDoc.getPages()[0]


  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const drawText = (text, x, y, size = 11) => {
    page1.drawText(text, { x, y, size, font })
  }

  drawText(`${firstname} ${lastname}`, 119, 696)
  drawText(birthdate, 119, 674)
  drawText(birthplace, 297, 674)
  drawText(`${address} ${zipcode} ${city}`, 133, 652)

  reasons
    .forEach(reason => {
      drawText('x', 78, reason.pos, 18)
    })

  let locationSize = getIdealFontSize(font, city, 83, 7, 11)

  if (!locationSize) {
    alert(
      'Le nom de la ville risque de ne pas être affiché correctement en raison de sa longueur. ' +
        'Essayez d\'utiliser des abréviations ("Saint" en "St." par exemple) quand cela est possible.',
    )
    locationSize = 7
  }

  drawText(city, 105, 177, locationSize)
  drawText(`${dateFormatted}`, 91, 153, 11)
  drawText(`${time}`, 264, 153, 11)

  const generatedQR = await generateQR(data)

  const qrImage = await pdfDoc.embedPng(generatedQR)

  page1.drawImage(qrImage, {
    x: page1.getWidth() - 156,
    y: 100,
    width: 92,
    height: 92,
  })

  pdfDoc.addPage()
  const page2 = pdfDoc.getPages()[1]
  page2.drawImage(qrImage, {
    x: 50,
    y: page2.getHeight() - 350,
    width: 300,
    height: 300,
  })

  const pdfBytes = await pdfDoc.save()

  return new Blob([pdfBytes], { type: 'application/pdf' })
}

function getIdealFontSize (font, text, maxWidth, minSize, defaultSize) {
  let currentSize = defaultSize
  let textWidth = font.widthOfTextAtSize(text, defaultSize)

  while (textWidth > maxWidth && currentSize > minSize) {
    textWidth = font.widthOfTextAtSize(text, --currentSize)
  }

  return textWidth > maxWidth ? null : currentSize
}