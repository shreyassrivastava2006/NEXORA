export const LMO_OFFICERS = [
  { id: "LMO-1", name: "Srajal", type: "LMO", district: "Lucknow" },
  { id: "LMO-2", name: "Amit Singh", type: "LMO", district: "Lucknow" },
  { id: "GAT-1", name: "Test Centre", type: "GAT", district: "Transport Nagar" },
];

const STARTER_SCALES = [
  {
    id: "APP-2026-4419",
    serialNumber: "IND-WT-77102",
    businessName: "Demo Store",
    location: "Shop 14, Hazratganj, Lucknow",
    locationTag: "Counter 1",
    category: "Class II High Precision Scale (Jewelry)",
    capacity: "500 g",
    mpeTolerance: "± 0.05 g",
    appliedDate: "2026-09-04",
    status: "PENDING_ASSIGNMENT",
    assignedTo: null,
    officerName: null,
    validUntil: "Awaiting Calibration",
    stampedDate: "Pending Inspection",
  },
  {
    id: "CERT-2026-8812",
    serialNumber: "IND-WT-99421",
    businessName: "Demo Store",
    location: "Hazratganj, Lucknow",
    locationTag: "Counter 2",
    category: "Class II High Precision Scale (Jewelry)",
    capacity: "500 g",
    mpeTolerance: "± 0.05 g",
    appliedDate: "2026-03-15",
    status: "VERIFIED",
    assignedTo: "LMO-1",
    officerName: "Srajal",
    validUntil: "2027-03-15",
    stampedDate: "2026-03-15",
  },
  {
    id: "CERT-2024-1109",
    serialNumber: "IND-PB-00213",
    businessName: "Demo Store",
    location: "Hazratganj, Lucknow",
    locationTag: "Storage Area",
    category: "Class IV Industrial Weighbridge (50 Ton)",
    capacity: "50,000 kg",
    mpeTolerance: "± 20 kg",
    appliedDate: "2024-05-10",
    status: "EXPIRED",
    assignedTo: "LMO-2",
    officerName: "Amit Singh",
    validUntil: "2025-05-10",
    stampedDate: "2024-05-10",
  },
];

const STORAGE_KEY = "metrology_scales";
const GRIEVANCE_KEY = "metrology_grievances";

function today() {
  return new Date().toISOString().split("T")[0];
}

function makeId(prefix) {
  return `${prefix}-2026-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function getAllScales() {
  const savedScales = localStorage.getItem(STORAGE_KEY);

  if (!savedScales) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(STARTER_SCALES));
    return STARTER_SCALES;
  }

  return JSON.parse(savedScales);
}

function saveScales(scales) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scales));
  return scales;
}

export function getAssignableOfficers() {
  const savedUsers = localStorage.getItem("all_users");
  const users = savedUsers ? JSON.parse(savedUsers) : [];

  const registeredOfficers = users
    .filter((user) => user.role === "LMO" || user.role === "GAT")
    .map((user) => ({
      id: user.badgeId,
      name: user.officerName || user.email,
      type: user.role,
      district: user.district || "Unassigned district",
    }))
    .filter((officer) => officer.id);

  return registeredOfficers.length ? registeredOfficers : LMO_OFFICERS;
}

export function getGrievances() {
  const savedGrievances = localStorage.getItem(GRIEVANCE_KEY);
  return savedGrievances ? JSON.parse(savedGrievances) : [];
}

export function reportGrievance(scaleId) {
  const scale = getAllScales().find((item) => item.id === scaleId);
  if (!scale) return null;

  const grievances = getGrievances();
  const existing = grievances.find((item) => item.scaleId === scaleId && item.status === "OPEN");
  if (existing) return existing;

  const grievance = {
    id: `GRV-${String(grievances.length + 1).padStart(2, "0")}`,
    scaleId: scale.id,
    serialNumber: scale.serialNumber,
    businessName: scale.businessName,
    location: scale.location,
    status: "OPEN",
    reportedAt: new Date().toISOString(),
  };

  localStorage.setItem(GRIEVANCE_KEY, JSON.stringify([grievance, ...grievances]));
  return grievance;
}

export function resolveGrievance(grievanceId) {
  const remaining = getGrievances().filter((item) => item.id !== grievanceId);
  localStorage.setItem(GRIEVANCE_KEY, JSON.stringify(remaining));
  return remaining;
}

function updateScale(scaleId, changes) {
  const updatedScales = getAllScales().map((scale) =>
    scale.id === scaleId ? { ...scale, ...changes } : scale
  );

  return saveScales(updatedScales);
}

export function submitInstrumentApplication(formData) {
  const serialAlreadyUsed = getAllScales().some(
    (scale) => scale.serialNumber.toUpperCase() === formData.serialNumber.toUpperCase()
  );

  if (serialAlreadyUsed) {
    return null;
  }

  const newScale = {
    ...formData,
    id: makeId("APP"),
    status: "PENDING_ASSIGNMENT",
    appliedDate: today(),
    assignedTo: null,
    officerName: null,
    validUntil: "Awaiting Calibration",
    stampedDate: "Pending Inspection",
  };

  return saveScales([newScale, ...getAllScales()]);
}

export function requestReverification(scaleId, requestedInspectionDate) {
  const scale = getAllScales().find((item) => item.id === scaleId);

  return updateScale(scaleId, {
    id: makeId("APP"),
    previousIds: [...(scale?.previousIds || []), scaleId],
    status: "PENDING_ASSIGNMENT",
    appliedDate: today(),
    requestedInspectionDate,
    scheduledInspectionDate: null,
    inspectionDate: null,
    stampedDate: "Pending Re-Inspection",
    validUntil: "Awaiting Re-stamping",
    assignedTo: null,
    officerName: null,
  });
}

export function assignInspectionTask(scaleId, officerId, scheduledInspectionDate) {
  const officer = getAssignableOfficers().find((item) => item.id === officerId);

  return updateScale(scaleId, {
    status: "ASSIGNED_TO_LMO",
    assignedTo: officerId,
    officerName: officer?.name || officerId,
    scheduledInspectionDate,
  });
}

export function certifyScale(scaleId, officerBadge, auditInfo = {}) {
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);

  return updateScale(scaleId, {
    id: makeId("CERT"),
    status: "VERIFIED",
    stampedDate: today(),
    inspectionDate: auditInfo.inspectionDate || today(),
    inspectionLocation: auditInfo.inspectionLocation || null,
    validUntil: expiryDate.toISOString().split("T")[0],
    officerCode: officerBadge || "LMO-1",
    sealPhotoUrl: auditInfo.photoUrl || null,
    errorRecorded: auditInfo.errorRecorded || "0.00 g",
    testMassUsed: auditInfo.testMassUsed,
    inspectionNotes: auditInfo.notes || "Scale passed the inspection.",
  });
}

export function rejectScale(scaleId, officerBadge, rejectionInfo = {}) {
  return updateScale(scaleId, {
    status: "REJECTED",
    stampedDate: "Inspection Rejected",
    validUntil: "Not Certified",
    inspectionDate: rejectionInfo.inspectionDate || today(),
    inspectionLocation: rejectionInfo.inspectionLocation || null,
    officerCode: officerBadge || "LMO-1",
    sealPhotoUrl: rejectionInfo.photoUrl || null,
    rejectionReason: rejectionInfo.reason || "The instrument did not pass inspection.",
    rejectionDate: today(),
    inspectionNotes: rejectionInfo.notes || "Inspection rejected.",
  });
}

export function findScale(searchText) {
  if (!searchText) return null;

  const search = searchText.trim().toUpperCase();
  return getAllScales().find((scale) =>
    scale.id.toUpperCase() === search ||
    scale.serialNumber.toUpperCase() === search ||
    scale.previousIds?.includes(search)
  ) || null;
}
