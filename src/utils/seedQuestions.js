import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from '../models/Question.js';

dotenv.config();

// Questions data from frontend
const questionsData = [
  {
    text: "Which of the following techniques is illustrated?",
    diagram: true,
    category: "clinical",
    options: [
      { text: "Potentiometry", explanation: "Potentiometry is an electroanalytic method that measures the potential of a solution between two electrodes to determine the concentration of an analyte in the solution.", isCorrect: false },
      { text: "Fluorometry", explanation: "The detector is perpendicular to the light source. This is important so that the light from the source is unable to interfere with the fluorescent light being measured. The monochromator is used to vary the wavelength. Nephelometry, which measures scattered light, also places the detector perpendicular to the light source.", isCorrect: true },
      { text: "Turbidimetry", explanation: "A turbidimeter measures light parallel to the source. Turbidimetry measures the deflection of light from undissolved particles. Nephelometry, which measures scattered light, places the detector perpendicular to the sample.", isCorrect: false },
      { text: "Coulometry", explanation: "Coulometry measures the electric current passed through an analyte.", isCorrect: false },
      { text: "Chromatography", explanation: "Chromatography separates the components of solute mixtures, by a distribution of the solutes through two phases: polar and non-polar.", isCorrect: false }
    ],
    summary: "Fluorometry and nephelometry detect light at 90 degrees to the source. Nephelometry can also detect light scatter at less than 90 degrees, usually at 70 or 30 degrees. When placed at these angles it is called forward light scatter nephelometry."
  },
  {
    text: "What is the most common cause of acute pancreatitis?",
    category: "anatomic",
    options: [
      { text: "Alcohol abuse", explanation: "While alcohol is a major cause, gallstones are actually more common.", isCorrect: false },
      { text: "Gallstones", explanation: "Gallstones are the most common cause of acute pancreatitis, accounting for approximately 40-50% of cases.", isCorrect: true },
      { text: "Hypertriglyceridemia", explanation: "This is a less common cause, accounting for about 1-4% of cases.", isCorrect: false },
      { text: "Hypercalcemia", explanation: "Hypercalcemia is a rare cause of acute pancreatitis.", isCorrect: false }
    ],
    summary: "Gallstones cause pancreatitis by obstructing the pancreatic duct, leading to autodigestion of pancreatic tissue."
  },
  {
    text: "Which cell type is primarily responsible for antibody production?",
    category: "clinical",
    options: [
      { text: "T cells", explanation: "T cells are primarily involved in cell-mediated immunity, not antibody production.", isCorrect: false },
      { text: "B cells", explanation: "B cells differentiate into plasma cells which produce antibodies (immunoglobulins).", isCorrect: true },
      { text: "Natural killer cells", explanation: "NK cells are part of innate immunity and kill infected or tumor cells.", isCorrect: false },
      { text: "Macrophages", explanation: "Macrophages are antigen-presenting cells and phagocytes, not antibody producers.", isCorrect: false }
    ],
    summary: "B lymphocytes are the only cells capable of producing antibodies in the adaptive immune response."
  },
  {
    text: "What is the gold standard for diagnosing celiac disease?",
    category: "anatomic",
    options: [
      { text: "Serology testing", explanation: "Serology (anti-tTG, anti-EMA) is used for screening but not diagnostic confirmation.", isCorrect: false },
      { text: "Small bowel biopsy", explanation: "Duodenal biopsy showing villous atrophy, crypt hyperplasia, and increased intraepithelial lymphocytes is the gold standard.", isCorrect: true },
      { text: "Genetic testing", explanation: "HLA-DQ2/DQ8 testing is useful for exclusion but not diagnostic on its own.", isCorrect: false },
      { text: "Clinical symptoms", explanation: "Symptoms alone are non-specific and insufficient for diagnosis.", isCorrect: false }
    ],
    summary: "Biopsy must be performed while the patient is on a gluten-containing diet to avoid false negatives."
  },
  {
    text: "Which stain is most commonly used to identify acid-fast bacteria?",
    category: "anatomic",
    options: [
      { text: "Gram stain", explanation: "Gram stain is ineffective for mycobacteria due to their waxy cell wall.", isCorrect: false },
      { text: "Ziehl-Neelsen stain", explanation: "This carbolfuchsin-based stain is the classic method for identifying acid-fast organisms like Mycobacterium tuberculosis.", isCorrect: true },
      { text: "PAS stain", explanation: "PAS stain is used for fungi and glycogen, not acid-fast bacteria.", isCorrect: false },
      { text: "Giemsa stain", explanation: "Giemsa is used for blood parasites and some bacteria, not acid-fast organisms.", isCorrect: false }
    ],
    summary: "Acid-fast bacteria retain carbolfuchsin dye even after acid-alcohol treatment due to mycolic acids in their cell wall."
  },
  {
    text: "What is the primary function of von Willebrand factor?",
    category: "clinical",
    options: [
      { text: "Platelet adhesion", explanation: "vWF mediates platelet adhesion to exposed collagen at sites of vascular injury.", isCorrect: true },
      { text: "Fibrin formation", explanation: "Fibrin formation is primarily mediated by thrombin converting fibrinogen to fibrin.", isCorrect: false },
      { text: "Clot dissolution", explanation: "Clot dissolution is performed by plasmin, not vWF.", isCorrect: false },
      { text: "Prothrombin activation", explanation: "Prothrombin activation is part of the coagulation cascade, not a vWF function.", isCorrect: false }
    ],
    summary: "vWF also acts as a carrier protein for Factor VIII, protecting it from degradation."
  },
  {
    text: "Which type of necrosis is most commonly seen in tuberculosis?",
    category: "anatomic",
    options: [
      { text: "Coagulative necrosis", explanation: "This is typical of ischemic injury in most solid organs.", isCorrect: false },
      { text: "Liquefactive necrosis", explanation: "This occurs in the brain and bacterial infections, not TB.", isCorrect: false },
      { text: "Caseous necrosis", explanation: "Caseous necrosis is characteristic of tuberculosis and some fungal infections, appearing as cheese-like material.", isCorrect: true },
      { text: "Fat necrosis", explanation: "Fat necrosis occurs in pancreatic disease and trauma to adipose tissue.", isCorrect: false }
    ],
    summary: "The term 'caseous' refers to the cheese-like appearance of the necrotic tissue on gross examination."
  },
  {
    text: "What is the most common site of colorectal cancer?",
    category: "anatomic",
    options: [
      { text: "Cecum", explanation: "Right-sided colon cancers are less common than left-sided.", isCorrect: false },
      { text: "Sigmoid colon and rectum", explanation: "Approximately 60% of colorectal cancers occur in the sigmoid colon and rectum.", isCorrect: true },
      { text: "Transverse colon", explanation: "This is one of the least common sites for colorectal cancer.", isCorrect: false },
      { text: "Ascending colon", explanation: "Right-sided cancers are less frequent than left-sided.", isCorrect: false }
    ],
    summary: "The distribution of colorectal cancer follows the adenoma-carcinoma sequence, with most adenomas also occurring in the left colon."
  },
  {
    text: "Which marker is most specific for hepatocellular carcinoma?",
    category: "clinical",
    options: [
      { text: "CEA", explanation: "CEA is elevated in many gastrointestinal malignancies but not specific for HCC.", isCorrect: false },
      { text: "CA 19-9", explanation: "CA 19-9 is associated with pancreatic and biliary cancers.", isCorrect: false },
      { text: "Alpha-fetoprotein (AFP)", explanation: "AFP is the most specific tumor marker for HCC, though it can also be elevated in germ cell tumors.", isCorrect: true },
      { text: "CA 125", explanation: "CA 125 is primarily associated with ovarian cancer.", isCorrect: false }
    ],
    summary: "AFP levels above 400 ng/mL are highly suggestive of HCC in the context of cirrhosis or chronic hepatitis."
  },
  {
    text: "What is the hallmark histological finding in Hodgkin lymphoma?",
    category: "anatomic",
    options: [
      { text: "Auer rods", explanation: "Auer rods are found in acute myeloid leukemia, not lymphoma.", isCorrect: false },
      { text: "Reed-Sternberg cells", explanation: "Reed-Sternberg cells are large, binucleated or multinucleated cells that are diagnostic of Hodgkin lymphoma.", isCorrect: true },
      { text: "Starry sky pattern", explanation: "This pattern is characteristic of Burkitt lymphoma.", isCorrect: false },
      { text: "Smudge cells", explanation: "Smudge cells are seen in chronic lymphocytic leukemia.", isCorrect: false }
    ],
    summary: "Reed-Sternberg cells typically have an 'owl's eye' appearance with two mirror-image nuclei."
  },
  {
    text: "Which type of hypersensitivity reaction is mediated by IgE?",
    category: "clinical",
    options: [
      { text: "Type I", explanation: "Type I hypersensitivity is IgE-mediated and causes immediate allergic reactions like anaphylaxis.", isCorrect: true },
      { text: "Type II", explanation: "Type II involves IgG or IgM antibodies against cell surface antigens.", isCorrect: false },
      { text: "Type III", explanation: "Type III involves immune complex deposition.", isCorrect: false },
      { text: "Type IV", explanation: "Type IV is T-cell mediated delayed hypersensitivity.", isCorrect: false }
    ],
    summary: "Type I reactions occur within minutes of antigen exposure and involve mast cell and basophil degranulation."
  },
  {
    text: "What is the most common inherited bleeding disorder?",
    category: "clinical",
    options: [
      { text: "Hemophilia A", explanation: "While common, von Willebrand disease is more prevalent.", isCorrect: false },
      { text: "Hemophilia B", explanation: "Hemophilia B is less common than Hemophilia A and von Willebrand disease.", isCorrect: false },
      { text: "Von Willebrand disease", explanation: "vWD affects up to 1% of the population, making it the most common inherited bleeding disorder.", isCorrect: true },
      { text: "Factor V Leiden", explanation: "This is a prothrombotic disorder, not a bleeding disorder.", isCorrect: false }
    ],
    summary: "Most cases of vWD are mild and may go undiagnosed until challenged by surgery or trauma."
  },
  {
    text: "Which organism causes pseudomembranous colitis?",
    category: "anatomic",
    options: [
      { text: "Escherichia coli", explanation: "E. coli causes various diarrheal illnesses but not pseudomembranous colitis.", isCorrect: false },
      { text: "Clostridioides difficile", explanation: "C. difficile produces toxins that cause pseudomembranous colitis, typically following antibiotic use.", isCorrect: true },
      { text: "Salmonella", explanation: "Salmonella causes gastroenteritis but not pseudomembranous colitis.", isCorrect: false },
      { text: "Campylobacter", explanation: "Campylobacter causes bacterial gastroenteritis but not pseudomembranes.", isCorrect: false }
    ],
    summary: "The pseudomembranes are composed of fibrin, mucin, inflammatory cells, and necrotic epithelium."
  },
  {
    text: "What is the characteristic cell in chronic myeloid leukemia?",
    category: "clinical",
    options: [
      { text: "Auer rods", explanation: "Auer rods are found in AML, not CML.", isCorrect: false },
      { text: "Philadelphia chromosome", explanation: "The Philadelphia chromosome (BCR-ABL fusion) is present in >95% of CML cases.", isCorrect: true },
      { text: "Hairy cells", explanation: "Hairy cells are found in hairy cell leukemia.", isCorrect: false },
      { text: "Smudge cells", explanation: "Smudge cells are characteristic of CLL.", isCorrect: false }
    ],
    summary: "The Philadelphia chromosome results from a translocation between chromosomes 9 and 22, t(9;22)."
  },
  {
    text: "Which immunoglobulin is most abundant in serum?",
    category: "clinical",
    options: [
      { text: "IgA", explanation: "IgA is most abundant in mucosal secretions, not serum.", isCorrect: false },
      { text: "IgG", explanation: "IgG comprises approximately 75% of serum immunoglobulins and is the only one that crosses the placenta.", isCorrect: true },
      { text: "IgM", explanation: "IgM is the first antibody produced in immune responses but less abundant than IgG.", isCorrect: false },
      { text: "IgE", explanation: "IgE is present in very low concentrations in serum.", isCorrect: false }
    ],
    summary: "IgG has four subclasses (IgG1-4) with different biological functions."
  },
  {
    text: "What is the primary pathological feature of emphysema?",
    category: "anatomic",
    options: [
      { text: "Bronchial wall thickening", explanation: "This is a feature of chronic bronchitis, not emphysema.", isCorrect: false },
      { text: "Airspace enlargement with wall destruction", explanation: "Emphysema is characterized by permanent enlargement of airspaces distal to terminal bronchioles with destruction of alveolar walls.", isCorrect: true },
      { text: "Excess mucus production", explanation: "This defines chronic bronchitis, not emphysema.", isCorrect: false },
      { text: "Pleural thickening", explanation: "Pleural thickening is not a primary feature of emphysema.", isCorrect: false }
    ],
    summary: "Emphysema leads to loss of elastic recoil and airway collapse during expiration, causing air trapping."
  },
  {
    text: "Which enzyme deficiency causes Gaucher disease?",
    category: "clinical",
    options: [
      { text: "Sphingomyelinase", explanation: "Deficiency of this enzyme causes Niemann-Pick disease.", isCorrect: false },
      { text: "Glucocerebrosidase", explanation: "Gaucher disease results from deficiency of glucocerebrosidase, leading to accumulation of glucocerebroside.", isCorrect: true },
      { text: "Hexosaminidase A", explanation: "Deficiency of this enzyme causes Tay-Sachs disease.", isCorrect: false },
      { text: "Alpha-galactosidase A", explanation: "Deficiency of this enzyme causes Fabry disease.", isCorrect: false }
    ],
    summary: "Gaucher disease is the most common lysosomal storage disorder and can present with hepatosplenomegaly and bone pain."
  },
  {
    text: "What is the most common primary malignant bone tumor in adults?",
    category: "anatomic",
    options: [
      { text: "Osteosarcoma", explanation: "Osteosarcoma is most common in adolescents and young adults, not older adults.", isCorrect: false },
      { text: "Multiple myeloma", explanation: "Multiple myeloma is the most common primary malignant bone tumor in adults over 40.", isCorrect: true },
      { text: "Chondrosarcoma", explanation: "This is the second most common primary bone malignancy in adults.", isCorrect: false },
      { text: "Ewing sarcoma", explanation: "Ewing sarcoma primarily affects children and young adults.", isCorrect: false }
    ],
    summary: "Multiple myeloma is a plasma cell neoplasm that produces lytic bone lesions and monoclonal proteins."
  },
  {
    text: "Which cell produces surfactant in the lung?",
    category: "anatomic",
    options: [
      { text: "Type I pneumocytes", explanation: "Type I cells cover most alveolar surface area but don't produce surfactant.", isCorrect: false },
      { text: "Type II pneumocytes", explanation: "Type II pneumocytes synthesize and secrete pulmonary surfactant, which reduces surface tension.", isCorrect: true },
      { text: "Clara cells", explanation: "Clara cells secrete protective proteins but not surfactant.", isCorrect: false },
      { text: "Alveolar macrophages", explanation: "These cells phagocytose debris and pathogens but don't produce surfactant.", isCorrect: false }
    ],
    summary: "Surfactant deficiency in premature infants causes neonatal respiratory distress syndrome."
  },
  {
    text: "What is the most common cause of acute glomerulonephritis in children?",
    category: "anatomic",
    options: [
      { text: "IgA nephropathy", explanation: "While common, post-streptococcal GN is the most frequent cause in children.", isCorrect: false },
      { text: "Post-streptococcal glomerulonephritis", explanation: "This follows group A beta-hemolytic streptococcal infection by 1-3 weeks and is the most common cause in children.", isCorrect: true },
      { text: "Rapidly progressive GN", explanation: "This is less common and more severe.", isCorrect: false },
      { text: "Lupus nephritis", explanation: "This occurs in systemic lupus erythematosus patients.", isCorrect: false }
    ],
    summary: "Post-streptococcal GN shows 'lumpy-bumpy' immune complex deposits on immunofluorescence."
  },
  {
    text: "Which stain is used to demonstrate amyloid deposits?",
    category: "anatomic",
    options: [
      { text: "H&E", explanation: "H&E shows amyloid as pink material but special stains are needed for confirmation.", isCorrect: false },
      { text: "Congo red", explanation: "Congo red stain shows apple-green birefringence under polarized light, diagnostic of amyloid.", isCorrect: true },
      { text: "PAS", explanation: "PAS stains glycogen and basement membranes, not amyloid specifically.", isCorrect: false },
      { text: "Trichrome", explanation: "Trichrome differentiates collagen from muscle but doesn't specifically identify amyloid.", isCorrect: false }
    ],
    summary: "Amyloid is composed of misfolded proteins arranged in beta-pleated sheet configuration."
  },
  {
    text: "What is the most common type of thyroid cancer?",
    category: "anatomic",
    options: [
      { text: "Follicular carcinoma", explanation: "This is the second most common type, accounting for 10-15% of cases.", isCorrect: false },
      { text: "Papillary carcinoma", explanation: "Papillary thyroid carcinoma accounts for 80-85% of thyroid cancers and has an excellent prognosis.", isCorrect: true },
      { text: "Medullary carcinoma", explanation: "This accounts for only 5-10% of thyroid cancers.", isCorrect: false },
      { text: "Anaplastic carcinoma", explanation: "This is rare but highly aggressive, comprising <5% of cases.", isCorrect: false }
    ],
    summary: "Papillary carcinoma shows characteristic nuclear features including ground-glass nuclei and nuclear grooves."
  },
  {
    text: "Which virus is associated with cervical cancer?",
    category: "anatomic",
    options: [
      { text: "HPV 6 and 11", explanation: "These low-risk HPV types cause genital warts, not cancer.", isCorrect: false },
      { text: "HPV 16 and 18", explanation: "These high-risk HPV types cause approximately 70% of cervical cancers.", isCorrect: true },
      { text: "HSV-2", explanation: "Herpes simplex virus is not directly oncogenic for cervical cancer.", isCorrect: false },
      { text: "EBV", explanation: "EBV is associated with nasopharyngeal carcinoma and some lymphomas, not cervical cancer.", isCorrect: false }
    ],
    summary: "HPV produces E6 and E7 proteins that inactivate p53 and Rb tumor suppressors respectively."
  },
  {
    text: "What is the classic triad of Wernicke encephalopathy?",
    category: "anatomic",
    options: [
      { text: "Confusion, ataxia, ophthalmoplegia", explanation: "This triad results from thiamine (B1) deficiency, commonly in chronic alcoholism.", isCorrect: true },
      { text: "Dementia, ataxia, incontinence", explanation: "This describes normal pressure hydrocephalus.", isCorrect: false },
      { text: "Tremor, rigidity, bradykinesia", explanation: "This triad is characteristic of Parkinson's disease.", isCorrect: false },
      { text: "Headache, papilledema, vomiting", explanation: "This suggests increased intracranial pressure.", isCorrect: false }
    ],
    summary: "Wernicke encephalopathy affects mammillary bodies and can progress to Korsakoff syndrome with permanent memory impairment."
  },
  {
    text: "Which antibody is associated with Goodpasture syndrome?",
    category: "anatomic",
    options: [
      { text: "Anti-GBM antibody", explanation: "Anti-glomerular basement membrane antibodies cause Goodpasture syndrome, affecting lungs and kidneys.", isCorrect: true },
      { text: "ANCA", explanation: "ANCA is associated with granulomatosis with polyangiitis and microscopic polyangiitis.", isCorrect: false },
      { text: "ANA", explanation: "ANA is found in systemic lupus erythematosus and other autoimmune diseases.", isCorrect: false },
      { text: "Anti-dsDNA", explanation: "This is specific for SLE, not Goodpasture syndrome.", isCorrect: false }
    ],
    summary: "Goodpasture syndrome presents with pulmonary hemorrhage and rapidly progressive glomerulonephritis."
  },
  {
    text: "What is the most common benign tumor of the liver?",
    category: "anatomic",
    options: [
      { text: "Focal nodular hyperplasia", explanation: "FNH is common but hemangioma is more frequent.", isCorrect: false },
      { text: "Hepatic adenoma", explanation: "Hepatic adenomas are less common and associated with oral contraceptive use.", isCorrect: false },
      { text: "Hemangioma", explanation: "Cavernous hemangioma is the most common benign liver tumor, often an incidental finding.", isCorrect: true },
      { text: "Lipoma", explanation: "Lipomas rarely occur in the liver.", isCorrect: false }
    ],
    summary: "Most hepatic hemangiomas are asymptomatic and require no treatment."
  },
  {
    text: "Which type of collagen is defective in osteogenesis imperfecta?",
    category: "anatomic",
    options: [
      { text: "Type I", explanation: "Type I collagen defects cause osteogenesis imperfecta, resulting in brittle bones and blue sclerae.", isCorrect: true },
      { text: "Type II", explanation: "Type II collagen defects affect cartilage, causing chondrodysplasias.", isCorrect: false },
      { text: "Type III", explanation: "Type III collagen is found in blood vessels and is defective in vascular Ehlers-Danlos syndrome.", isCorrect: false },
      { text: "Type IV", explanation: "Type IV collagen is in basement membranes; defects cause Alport syndrome.", isCorrect: false }
    ],
    summary: "Type I collagen is the most abundant protein in bone, skin, and tendons."
  },
  {
    text: "What is the characteristic finding in Paget disease of bone?",
    category: "anatomic",
    options: [
      { text: "Decreased alkaline phosphatase", explanation: "Alkaline phosphatase is actually elevated in Paget disease.", isCorrect: false },
      { text: "Increased osteoclastic and osteoblastic activity", explanation: "Paget disease involves excessive bone remodeling with both increased resorption and formation, creating a mosaic pattern.", isCorrect: true },
      { text: "Osteoporosis", explanation: "Paget disease causes thickened, deformed bones, not osteoporosis.", isCorrect: false },
      { text: "Osteolytic lesions only", explanation: "Paget disease has both lytic and blastic phases.", isCorrect: false }
    ],
    summary: "Paget disease most commonly affects the pelvis, spine, skull, and long bones."
  },
  {
    text: "Which organism most commonly causes acute bacterial endocarditis in IV drug users?",
    category: "anatomic",
    options: [
      { text: "Streptococcus viridans", explanation: "This causes subacute endocarditis, usually affecting abnormal valves.", isCorrect: false },
      { text: "Staphylococcus aureus", explanation: "S. aureus causes acute endocarditis and commonly affects the tricuspid valve in IV drug users.", isCorrect: true },
      { text: "Enterococcus", explanation: "Enterococcus is less common and typically affects older patients.", isCorrect: false },
      { text: "Streptococcus pneumoniae", explanation: "S. pneumoniae rarely causes endocarditis.", isCorrect: false }
    ],
    summary: "Tricuspid valve endocarditis in IVDU can cause septic pulmonary emboli."
  },
  {
    text: "What is the hallmark of irreversible cell injury?",
    category: "anatomic",
    options: [
      { text: "Cell swelling", explanation: "Cell swelling is a reversible change.", isCorrect: false },
      { text: "Membrane blebbing", explanation: "Blebbing can be reversible.", isCorrect: false },
      { text: "Mitochondrial damage with loss of membrane integrity", explanation: "Irreversible injury is marked by severe mitochondrial damage and loss of membrane integrity, including nuclear membrane breakdown.", isCorrect: true },
      { text: "Ribosome detachment", explanation: "Ribosome detachment is a reversible change.", isCorrect: false }
    ],
    summary: "Once mitochondrial membranes are severely damaged, ATP production fails and cell death is inevitable."
  },
  {
    text: "Which tumor marker is elevated in testicular cancer?",
    category: "clinical",
    options: [
      { text: "PSA", explanation: "PSA is specific for prostate cancer.", isCorrect: false },
      { text: "AFP and beta-hCG", explanation: "Alpha-fetoprotein and beta-human chorionic gonadotropin are elevated in non-seminomatous germ cell tumors.", isCorrect: true },
      { text: "CEA", explanation: "CEA is associated with GI malignancies.", isCorrect: false },
      { text: "CA 19-9", explanation: "CA 19-9 is elevated in pancreatic and biliary cancers.", isCorrect: false }
    ],
    summary: "Pure seminomas typically only elevate beta-hCG, not AFP."
  },
  {
    text: "What is the most common cause of acute liver failure in the United States?",
    category: "clinical",
    options: [
      { text: "Hepatitis B", explanation: "Hepatitis B is less common than acetaminophen toxicity.", isCorrect: false },
      { text: "Acetaminophen toxicity", explanation: "Acetaminophen overdose is the leading cause of acute liver failure in the US, accounting for ~50% of cases.", isCorrect: true },
      { text: "Hepatitis C", explanation: "Hepatitis C typically causes chronic rather than acute liver failure.", isCorrect: false },
      { text: "Alcohol", explanation: "Alcohol typically causes chronic liver disease rather than acute failure.", isCorrect: false }
    ],
    summary: "N-acetylcysteine is the antidote for acetaminophen toxicity and must be given within 8-10 hours for maximum effectiveness."
  },
  {
    text: "Which cell type is the 'pacemaker' of the heart?",
    category: "anatomic",
    options: [
      { text: "Purkinje fibers", explanation: "Purkinje fibers conduct impulses rapidly but don't initiate them.", isCorrect: false },
      { text: "SA node cells", explanation: "Sinoatrial node cells have the highest intrinsic rate of depolarization and set the heart rhythm.", isCorrect: true },
      { text: "AV node cells", explanation: "AV node cells slow conduction between atria and ventricles but are not the primary pacemaker.", isCorrect: false },
      { text: "Ventricular myocytes", explanation: "These contract in response to electrical signals but don't generate the rhythm.", isCorrect: false }
    ],
    summary: "The SA node is located at the junction of the superior vena cava and right atrium."
  },
  {
    text: "What is the characteristic histologic finding in sarcoidosis?",
    category: "anatomic",
    options: [
      { text: "Caseating granulomas", explanation: "Sarcoidosis produces non-caseating granulomas, unlike tuberculosis.", isCorrect: false },
      { text: "Non-caseating granulomas", explanation: "Sarcoidosis shows well-formed, non-caseating epithelioid granulomas, often with giant cells.", isCorrect: true },
      { text: "Eosinophilic infiltrate", explanation: "Eosinophils are not a prominent feature of sarcoidosis.", isCorrect: false },
      { text: "Vasculitis", explanation: "Sarcoidosis is not primarily a vasculitic disease.", isCorrect: false }
    ],
    summary: "Sarcoid granulomas may contain asteroid bodies or Schaumann bodies."
  },
  {
    text: "Which immunoglobulin is produced first in a primary immune response?",
    category: "clinical",
    options: [
      { text: "IgG", explanation: "IgG is produced later and predominates in secondary responses.", isCorrect: false },
      { text: "IgM", explanation: "IgM is the first antibody produced in response to antigen and is the largest immunoglobulin.", isCorrect: true },
      { text: "IgA", explanation: "IgA is important in mucosal immunity but not the first responder.", isCorrect: false },
      { text: "IgE", explanation: "IgE is involved in allergic reactions, not primary immune responses.", isCorrect: false }
    ],
    summary: "IgM is pentameric, making it very effective at complement activation and agglutination."
  },
  {
    text: "What is the most common type of esophageal cancer in the United States?",
    category: "anatomic",
    options: [
      { text: "Squamous cell carcinoma", explanation: "Squamous cell carcinoma was historically most common but has been surpassed by adenocarcinoma.", isCorrect: false },
      { text: "Adenocarcinoma", explanation: "Esophageal adenocarcinoma is now most common in the US, usually arising from Barrett's esophagus in the distal esophagus.", isCorrect: true },
      { text: "Small cell carcinoma", explanation: "Small cell carcinoma rarely occurs in the esophagus.", isCorrect: false },
      { text: "Lymphoma", explanation: "Primary esophageal lymphoma is very rare.", isCorrect: false }
    ],
    summary: "Risk factors for adenocarcinoma include GERD, Barrett's esophagus, obesity, and smoking."
  },
  {
    text: "Which condition is associated with HLA-B27?",
    category: "clinical",
    options: [
      { text: "Rheumatoid arthritis", explanation: "RA is associated with HLA-DR4, not HLA-B27.", isCorrect: false },
      { text: "Ankylosing spondylitis", explanation: "HLA-B27 is strongly associated with ankylosing spondylitis and other seronegative spondyloarthropathies.", isCorrect: true },
      { text: "Systemic lupus erythematosus", explanation: "SLE is associated with HLA-DR2 and HLA-DR3.", isCorrect: false },
      { text: "Multiple sclerosis", explanation: "MS is associated with HLA-DR2.", isCorrect: false }
    ],
    summary: "~90% of patients with ankylosing spondylitis are HLA-B27 positive, though only ~5% of HLA-B27 positive individuals develop the disease."
  },
  {
    text: "What is the most common primary brain tumor in adults?",
    category: "anatomic",
    options: [
      { text: "Meningioma", explanation: "Meningiomas are the most common primary brain tumor in adults, usually benign.", isCorrect: true },
      { text: "Glioblastoma", explanation: "Glioblastoma is the most common malignant primary brain tumor, but meningiomas are more common overall.", isCorrect: false },
      { text: "Astrocytoma", explanation: "Astrocytomas are common but less frequent than meningiomas.", isCorrect: false },
      { text: "Medulloblastoma", explanation: "Medulloblastomas primarily affect children.", isCorrect: false }
    ],
    summary: "Meningiomas arise from arachnoid cap cells and are more common in women."
  },
  {
    text: "Which type of shock is characterized by increased cardiac output?",
    category: "clinical",
    options: [
      { text: "Cardiogenic shock", explanation: "Cardiogenic shock has decreased cardiac output due to pump failure.", isCorrect: false },
      { text: "Hypovolemic shock", explanation: "Hypovolemic shock has decreased cardiac output due to reduced preload.", isCorrect: false },
      { text: "Septic shock", explanation: "Early septic (distributive) shock has increased cardiac output with decreased systemic vascular resistance.", isCorrect: true },
      { text: "Obstructive shock", explanation: "Obstructive shock has decreased cardiac output due to mechanical obstruction.", isCorrect: false }
    ],
    summary: "In late septic shock, myocardial depression can occur, leading to decreased cardiac output."
  },
  {
    text: "What is the most common cause of viral encephalitis in the United States?",
    category: "anatomic",
    options: [
      { text: "Rabies virus", explanation: "Rabies is very rare in the US due to vaccination programs.", isCorrect: false },
      { text: "Herpes simplex virus", explanation: "HSV-1 is the most common cause of sporadic fatal encephalitis in the US, with predilection for temporal lobes.", isCorrect: true },
      { text: "West Nile virus", explanation: "West Nile virus is less common than HSV.", isCorrect: false },
      { text: "Cytomegalovirus", explanation: "CMV encephalitis primarily affects immunocompromised patients.", isCorrect: false }
    ],
    summary: "HSV encephalitis shows hemorrhagic necrosis of temporal lobes on imaging and histology."
  },
  {
    text: "Which cells produce insulin?",
    category: "clinical",
    options: [
      { text: "Alpha cells", explanation: "Alpha cells produce glucagon.", isCorrect: false },
      { text: "Beta cells", explanation: "Beta cells in the pancreatic islets of Langerhans produce and secrete insulin.", isCorrect: true },
      { text: "Delta cells", explanation: "Delta cells produce somatostatin.", isCorrect: false },
      { text: "PP cells", explanation: "PP cells produce pancreatic polypeptide.", isCorrect: false }
    ],
    summary: "Destruction of beta cells by autoimmune mechanisms causes type 1 diabetes mellitus."
  },
  {
    text: "What is the most common site of hypertensive hemorrhage in the brain?",
    category: "anatomic",
    options: [
      { text: "Cerebral cortex", explanation: "Cortical hemorrhages are less common in hypertension.", isCorrect: false },
      { text: "Basal ganglia", explanation: "The basal ganglia, particularly the putamen, is the most common site of hypertensive intracerebral hemorrhage.", isCorrect: true },
      { text: "Cerebellum", explanation: "Cerebellar hemorrhages account for only ~10% of hypertensive hemorrhages.", isCorrect: false },
      { text: "Brainstem", explanation: "Brainstem hemorrhages are less common but highly morbid.", isCorrect: false }
    ],
    summary: "Hypertensive hemorrhages typically occur in small penetrating vessels damaged by chronic hypertension."
  },
  {
    text: "Which enzyme is deficient in phenylketonuria?",
    category: "clinical",
    options: [
      { text: "Tyrosinase", explanation: "Tyrosinase deficiency causes albinism.", isCorrect: false },
      { text: "Phenylalanine hydroxylase", explanation: "PKU results from deficiency of phenylalanine hydroxylase, causing accumulation of phenylalanine.", isCorrect: true },
      { text: "Homogentisic acid oxidase", explanation: "Deficiency of this enzyme causes alkaptonuria.", isCorrect: false },
      { text: "Fumarylacetoacetate hydrolase", explanation: "Deficiency causes tyrosinemia type 1.", isCorrect: false }
    ],
    summary: "Untreated PKU causes intellectual disability, which can be prevented by dietary restriction of phenylalanine."
  },
  {
    text: "What is the characteristic cell in infectious mononucleosis?",
    category: "clinical",
    options: [
      { text: "Reed-Sternberg cells", explanation: "These are found in Hodgkin lymphoma.", isCorrect: false },
      { text: "Atypical lymphocytes", explanation: "Infectious mononucleosis shows atypical (reactive) T lymphocytes responding to EBV-infected B cells.", isCorrect: true },
      { text: "Plasma cells", explanation: "Plasma cells are not characteristic of infectious mononucleosis.", isCorrect: false },
      { text: "Auer rods", explanation: "Auer rods are found in acute myeloid leukemia.", isCorrect: false }
    ],
    summary: "EBV causes infectious mononucleosis, characterized by fever, pharyngitis, lymphadenopathy, and splenomegaly."
  },
  {
    text: "Which valve is most commonly affected in rheumatic heart disease?",
    category: "anatomic",
    options: [
      { text: "Aortic valve", explanation: "The aortic valve is frequently affected but less than the mitral valve.", isCorrect: false },
      { text: "Mitral valve", explanation: "The mitral valve is most commonly affected in rheumatic heart disease, causing stenosis and/or regurgitation.", isCorrect: true },
      { text: "Tricuspid valve", explanation: "Tricuspid involvement is less common.", isCorrect: false },
      { text: "Pulmonic valve", explanation: "The pulmonic valve is rarely affected.", isCorrect: false }
    ],
    summary: "Rheumatic heart disease follows group A streptococcal pharyngitis and is caused by molecular mimicry."
  },
  {
    text: "What is the most common renal stone composition?",
    category: "clinical",
    options: [
      { text: "Struvite", explanation: "Struvite stones occur with urease-producing bacteria but are less common overall.", isCorrect: false },
      { text: "Calcium oxalate", explanation: "Calcium oxalate stones account for ~80% of renal stones and are radiopaque.", isCorrect: true },
      { text: "Uric acid", explanation: "Uric acid stones are radiolucent and associated with gout and acidic urine.", isCorrect: false },
      { text: "Cystine", explanation: "Cystine stones are rare and occur in cystinuria.", isCorrect: false }
    ],
    summary: "Risk factors for calcium oxalate stones include hypercalciuria, hyperoxaluria, and low urine volume."
  },
  {
    text: "Which immunodeficiency is associated with absent thymic shadow?",
    category: "clinical",
    options: [
      { text: "Bruton agammaglobulinemia", explanation: "This is a B-cell deficiency with normal thymus.", isCorrect: false },
      { text: "DiGeorge syndrome", explanation: "DiGeorge syndrome involves thymic hypoplasia/aplasia due to 22q11 deletion, causing T-cell deficiency.", isCorrect: true },
      { text: "Wiskott-Aldrich syndrome", explanation: "This affects platelets and immune cells but doesn't primarily involve the thymus.", isCorrect: false },
      { text: "Selective IgA deficiency", explanation: "This is a B-cell problem, not related to thymic development.", isCorrect: false }
    ],
    summary: "DiGeorge syndrome also features cardiac defects, parathyroid hypoplasia (hypocalcemia), and facial abnormalities (CATCH-22)."
  },
  {
    text: "What is the characteristic microscopic finding in acute myocardial infarction at 1-3 days?",
    category: "anatomic",
    options: [
      { text: "Coagulative necrosis with neutrophils", explanation: "At 1-3 days post-MI, coagulative necrosis with neutrophilic infiltrate is characteristic.", isCorrect: true },
      { text: "Granulation tissue", explanation: "Granulation tissue appears around 1 week post-MI.", isCorrect: false },
      { text: "Collagen scar", explanation: "Scar formation takes several weeks.", isCorrect: false },
      { text: "No changes visible", explanation: "Changes begin within 4-12 hours, with clear changes by 1-3 days.", isCorrect: false }
    ],
    summary: "The earliest gross change is pallor at 12-24 hours, followed by yellowing at 1-3 days."
  },
  {
    text: "Which hepatitis virus is transmitted via fecal-oral route?",
    category: "clinical",
    options: [
      { text: "Hepatitis B", explanation: "Hepatitis B is transmitted parenterally and sexually.", isCorrect: false },
      { text: "Hepatitis A", explanation: "Hepatitis A is transmitted via fecal-oral route and does not cause chronic infection.", isCorrect: true },
      { text: "Hepatitis C", explanation: "Hepatitis C is transmitted parenterally.", isCorrect: false },
      { text: "Hepatitis D", explanation: "Hepatitis D requires HBV co-infection and is transmitted parenterally.", isCorrect: false }
    ],
    summary: "Hepatitis E also follows fecal-oral transmission and can be severe in pregnant women."
  },
  {
    text: "What is the most common cause of death in patients with diabetes mellitus?",
    category: "clinical",
    options: [
      { text: "Diabetic ketoacidosis", explanation: "DKA is a serious complication but not the leading cause of death.", isCorrect: false },
      { text: "Cardiovascular disease", explanation: "Cardiovascular disease, including MI and stroke, is the leading cause of death in diabetic patients.", isCorrect: true },
      { text: "Renal failure", explanation: "Renal failure is a major complication but less common than cardiovascular death.", isCorrect: false },
      { text: "Infection", explanation: "Infections are more common in diabetics but not the leading cause of death.", isCorrect: false }
    ],
    summary: "Diabetes accelerates atherosclerosis through multiple mechanisms including endothelial dysfunction and dyslipidemia."
  }
];

const seedQuestions = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pathdojo');
    console.log('✅ Connected to MongoDB');

    // Clear existing questions
    await Question.deleteMany({});
    console.log('🗑️  Cleared existing questions');

    // Insert questions
    const questions = await Question.insertMany(questionsData);
    console.log(`✅ Seeded ${questions.length} questions successfully`);

    // Get category counts
    const categoryCounts = await Question.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📊 Questions by category:');
    categoryCounts.forEach(cat => {
      console.log(`   ${cat._id}: ${cat.count} questions`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding questions:', error);
    process.exit(1);
  }
};

seedQuestions();




