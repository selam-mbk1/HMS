import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { useHospital } from '../../context/HospitalContext';
import { BloodGroup } from '../../types';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddPatientModal: React.FC<AddPatientModalProps> = ({ isOpen, onClose }) => {
  const { addPatient } = useHospital();

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '1990-01-01',
    age: 36,
    gender: 'MALE' as 'MALE' | 'FEMALE' | 'OTHER',
    bloodGroup: 'O+' as BloodGroup,
    phone: '+251 9',
    email: '',
    address: '',
    city: 'Addis Ababa',
    subCity: 'Bole',
    assignedDepartment: 'Internal Medicine',
    emergencyContactName: '',
    emergencyContactRel: 'Spouse',
    emergencyContactPhone: '+251 9',
    allergiesInput: '',
    conditionsInput: '',
    insuranceProvider: 'Self Pay (Private)',
    insurancePolicyNumber: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.firstName.trim()) errs.firstName = 'First name is required';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required';
    if (!formData.phone.trim() || formData.phone.length < 9) errs.phone = 'Valid phone number required';
    if (!formData.emergencyContactName.trim()) errs.emergencyContactName = 'Emergency contact name required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const allergies = formData.allergiesInput
      ? formData.allergiesInput.split(',').map(s => s.trim()).filter(Boolean)
      : ['None known'];

    const chronicConditions = formData.conditionsInput
      ? formData.conditionsInput.split(',').map(s => s.trim()).filter(Boolean)
      : ['None'];

    addPatient({
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      dob: formData.dob,
      age: Number(formData.age),
      gender: formData.gender,
      bloodGroup: formData.bloodGroup,
      phone: formData.phone,
      email: formData.email || `${formData.firstName.toLowerCase()}@example.com`,
      address: formData.address || `${formData.subCity}, Addis Ababa`,
      city: formData.city,
      subCity: formData.subCity,
      status: 'ACTIVE',
      assignedDepartment: formData.assignedDepartment,
      emergencyContact: {
        name: formData.emergencyContactName,
        relationship: formData.emergencyContactRel,
        phone: formData.emergencyContactPhone
      },
      allergies,
      chronicConditions,
      insuranceProvider: formData.insuranceProvider,
      insurancePolicyNumber: formData.insurancePolicyNumber
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register New Patient" subtitle="Create an official electronic Medical Record Number (MRN)" maxWidth="3xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b border-blue-100 pb-1.5 mb-3">
            1. Personal Demographics
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="e.g. Abebe"
                className={`w-full px-3 py-2 text-xs border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 ${errors.firstName ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'}`}
              />
              {errors.firstName && <p className="text-[11px] text-rose-500 mt-1">{errors.firstName}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Father's Name (Middle)</label>
              <input
                type="text"
                value={formData.middleName}
                onChange={e => setFormData({ ...formData, middleName: e.target.value })}
                placeholder="e.g. Kebede"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Grandfather's Name (Last) *</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="e.g. Girma"
                className={`w-full px-3 py-2 text-xs border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 ${errors.lastName ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'}`}
              />
              {errors.lastName && <p className="text-[11px] text-rose-500 mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={formData.dob}
                onChange={e => setFormData({ ...formData, dob: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Age (Years)</label>
              <input
                type="number"
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Biological Gender</label>
              <select
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
              <select
                value={formData.bloodGroup}
                onChange={e => setFormData({ ...formData, bloodGroup: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Contact & Location */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b border-blue-100 pb-1.5 mb-3">
            2. Contact & Residential Details
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (+251) *</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full px-3 py-2 text-xs border rounded-xl focus:outline-hidden ${errors.phone ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'}`}
              />
              {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="optional@domain.com"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Sub-City (Addis Ababa)</label>
              <select
                value={formData.subCity}
                onChange={e => setFormData({ ...formData, subCity: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
              >
                {['Bole', 'Kirkos', 'Yeka', 'Arada', 'Nifas Silk-Lafto', 'Lideta', 'Kolfe Keranio', 'Gulele', 'Akaki Kality', 'Addis Ketema'].map(sc => (
                  <option key={sc} value={sc}>{sc}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Specific Residential Address (Woreda / House #)</label>
            <input
              type="text"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. Woreda 03, House #104, Near Edna Mall"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b border-blue-100 pb-1.5 mb-3">
            3. Emergency Contact (Next of Kin)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Full Name *</label>
              <input
                type="text"
                value={formData.emergencyContactName}
                onChange={e => setFormData({ ...formData, emergencyContactName: e.target.value })}
                placeholder="e.g. Tirhas Kebede"
                className={`w-full px-3 py-2 text-xs border rounded-xl focus:outline-hidden ${errors.emergencyContactName ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'}`}
              />
              {errors.emergencyContactName && <p className="text-[11px] text-rose-500 mt-1">{errors.emergencyContactName}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Relationship</label>
              <select
                value={formData.emergencyContactRel}
                onChange={e => setFormData({ ...formData, emergencyContactRel: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
              >
                <option value="Spouse">Spouse</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Son">Son</option>
                <option value="Daughter">Daughter</option>
                <option value="Sibling">Sibling</option>
                <option value="Guardian">Guardian</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Phone</label>
              <input
                type="text"
                value={formData.emergencyContactPhone}
                onChange={e => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Clinical Alerts & Insurance */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b border-blue-100 pb-1.5 mb-3">
            4. Clinical Background & Insurance
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Known Drug/Food Allergies</label>
              <input
                type="text"
                value={formData.allergiesInput}
                onChange={e => setFormData({ ...formData, allergiesInput: e.target.value })}
                placeholder="e.g. Penicillin, Sulfa drugs, Aspirin (comma separated)"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
              />
              <span className="text-[10px] text-slate-400">Leave blank if patient reports no known allergies</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Existing Chronic Conditions</label>
              <input
                type="text"
                value={formData.conditionsInput}
                onChange={e => setFormData({ ...formData, conditionsInput: e.target.value })}
                placeholder="e.g. Diabetes Mellitus, Hypertension, Asthma"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Method / Insurance Provider</label>
              <select
                value={formData.insuranceProvider}
                onChange={e => setFormData({ ...formData, insuranceProvider: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
              >
                <option value="Self Pay (Private)">Self Pay (Private)</option>
                <option value="Ethiopian Health Insurance Agency (EHIA)">Ethiopian Health Insurance Agency (EHIA)</option>
                <option value="United Insurance Ethiopia">United Insurance Ethiopia</option>
                <option value="Nyala Insurance SC">Nyala Insurance SC</option>
                <option value="Awash Insurance Company">Awash Insurance Company</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Insurance Policy Number</label>
              <input
                type="text"
                value={formData.insurancePolicyNumber}
                onChange={e => setFormData({ ...formData, insurancePolicyNumber: e.target.value })}
                placeholder="e.g. EHIA-ADD-901844"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition"
          >
            Save & Register Patient
          </button>
        </div>
      </form>
    </Modal>
  );
};
