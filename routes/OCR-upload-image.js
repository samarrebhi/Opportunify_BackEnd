const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

/*
/// hedhi b easyOCr python
const { exec } = require('child_process');
const ocrScriptPath = 'C:/Users/rebhi/OneDrive/Bureau/Opportunify/Opportunify_BackEnd/OCR/ocr.py';


router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const imagePath = req.file.path;
        async function performOCR(imagePath) {
          return new Promise((resolve, reject) => {
              const command = `python ${ocrScriptPath} ${imagePath}`;
                            exec(command, (error, stdout, stderr) => {
                  if (error) {
                      console.error("Error running Python script:", stderr);
                      reject(error);
                  } else {
                      resolve(stdout);
                  }
              });
          });
      }
        const extractedText = await performOCR(imagePath);

        if (extractedText) {
            res.json({ success: true, extractedText: extractedText });
        } else {
            res.json({ success: false, error: 'No text was extracted from the image.' });
        }
    } catch (error) {
        console.error('Error during OCR:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});
*/

////hedhi b tesseract

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file.path;
    const jobInfo  = await Tesseract.recognize(imagePath, 'eng');


    if (!jobInfo) {
        res.json({ success: false, error: 'No text was extracted from the image.' });
        return;
    }console.log('OCR Output:', jobInfo); 
    res.json({ success: true, jobInfo: jobInfo.data.text  });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/extract-job-info', upload.single('image'), async (req, res) => {
  try {
     
      if (!req.file) {
          return res.status(400).json({ success: false, error: 'No image file uploaded.' });
      }

      
      const { data: { text } } = await Tesseract.recognize(req.file.path, 'eng');

      ////lkelmet li ynajmou ykounou mawjoudin as job offer details
      const titleRegex = /(?:title|Job Offer): (.+)/i;
      const descriptionRegex = /(?:description|Description): (.+)/i;
      const qualificationsRegex = /(?:qualifications|Qualifications):(.+)/i;
      const responsibilitiesRegex = /(?:responsibilities|Responsibilities): (.+)/i;
      const locationRegex = /(?:location|city|Location|City|Lieu): (.+)/i; 
      const salary_informationRegex = /(?:Salary Information|Salary): (.+)/i;
      const Workplace_TypeRegex = /Workplace Type: (.+)/i;
      const CompanyRegex = /(?:company|Company|companyName) (.+)/i;
      const fieldRegex = /(?:Field|field): (.+)/i;
      const LangaguaeRegex= /(?:Language|language): (.+)/i;

      const DeadlineRegrex=/(?:Deadline|deadline): (.+)/i;

      ////////extraction
      const titleMatch = titleRegex.exec(text);
      const descriptionMatch = descriptionRegex.exec(text);
      const qualificationsMatch = qualificationsRegex.exec(text);
      const responsibilitiesMatch = responsibilitiesRegex.exec(text);
      const locationMatch = locationRegex.exec(text);
      const salary_informationMatch = salary_informationRegex.exec(text);
      const Workplace_TypeMatch = Workplace_TypeRegex.exec(text);

      const CompanyMatch = CompanyRegex.exec(text);
      const fieldMatch = fieldRegex.exec(text);
      const LangaguaeMatch = LangaguaeRegex.exec(text);
      const DeadlineMatch = DeadlineRegrex.exec(text);


      
      
      
      const jobInfo = {
          title: titleMatch ? titleMatch[1].trim() : null,
          description: descriptionMatch ? descriptionMatch[1].trim() : null,
          qualifications: qualificationsMatch ? qualificationsMatch[1].trim() : null,
          responsibilities: responsibilitiesMatch ? responsibilitiesMatch[1].trim() : null,
          lieu: locationMatch ? locationMatch[1].trim() : null,
          salary_informations: salary_informationMatch ? salary_informationMatch[1].trim():null,
          workplace_type : Workplace_TypeMatch ? Workplace_TypeMatch[1].trim():null,
         Company : CompanyMatch ? CompanyMatch[1].trim():null, 
         field : fieldMatch ? fieldMatch[1].trim():null,
         langue : LangaguaeMatch ? LangaguaeMatch[1].trim():null,
         deadline : DeadlineMatch ? DeadlineMatch[1].trim():null,

         
        
      };

      

     
      res.json({ success: true, jobInfo });
  } catch (error) {
      res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
/*
// Function to parse OCR output and extract job information
function parseJobInfo(text) {
  // Implement your logic to extract job title, salary, location, qualifications, etc.
  const jobInfo = {
    title: extractJobTitle(text),
    salary: extractSalary(text),
    location: extractLocation(text),
    qualifications: extractQualifications(text),
    // Add other fields as needed
  };
  return jobInfo;
}
/*
// Implement specific extraction functions as needed
function extractJobTitle(text) {
  // Add logic to extract job title
  return 'Sample Job Title';
}

function extractSalary(text) {
  // Add logic to extract salary information
  return '$50,000';
}

function extractLocation(text) {
  // Add logic to extract location
  return 'New York, NY';
}

function extractQualifications(text) {
  // Add logic to extract qualifications
  return 'Bachelor\'s degree in Computer Science';
}

*/
