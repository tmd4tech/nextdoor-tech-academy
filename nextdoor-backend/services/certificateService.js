const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateCertificate = async (studentName, courseName, completionDate, certificateId) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const filename = `certificate-${certificateId}.pdf`;
      const filepath = path.join(__dirname, '../certificates', filename);

      // Ensure directory exists
      if (!fs.existsSync(path.dirname(filepath))) {
        fs.mkdirSync(path.dirname(filepath), { recursive: true });
      }

      const stream = fs.createWriteStream(filepath);

      doc.pipe(stream);

      // Certificate design
      doc.fontSize(30).text('Certificate of Completion', { align: 'center' });
      doc.moveDown();
      doc.fontSize(14).text('Nextdoor Tech Academy', { align: 'center' });
      doc.moveDown(2);

      doc.fontSize(12).text('This is to certify that', { align: 'center' });
      doc.moveDown();
      doc.fontSize(18).text(studentName, { align: 'center', underline: true });
      doc.moveDown();

      doc.fontSize(12).text('has successfully completed the course', { align: 'center' });
      doc.moveDown();
      doc.fontSize(18).text(courseName, { align: 'center', underline: true });
      doc.moveDown();

      doc.fontSize(12).text(`Completed on: ${completionDate}`, { align: 'center' });
      doc.moveDown();
      doc.fontSize(10).text(`Certificate ID: ${certificateId}`, { align: 'center' });

      doc.end();

      stream.on('finish', () => {
        resolve({
          filename,
          path: filepath,
        });
      });

      stream.on('error', (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateCertificate,
};
