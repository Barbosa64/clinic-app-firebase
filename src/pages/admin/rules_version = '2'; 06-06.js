rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    function isAdmin() {
      return request.auth != null &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }

    function isDoctor() {
      return request.auth != null &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "doctor";
    }

    function isPatient() {
      return request.auth != null &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "patient";
    }

    match /users/{userId} {
      allow read: if isAdmin()
               || (request.auth != null && request.auth.uid == userId)
               || isDoctor()
               || (isPatient() && get(/databases/$(database)/documents/users/$(userId)).data.role == 'doctor');

      allow write: if isAdmin() || (request.auth != null && request.auth.uid == userId);
    }

    match /Appointments/{appointmentId} {
      allow read: if isAdmin()
               || isDoctor()
               || (isPatient() && resource.data.patientId == request.auth.uid);

      allow create: if isAdmin()
                 || (isPatient() && request.resource.data.patientId == request.auth.uid);

      allow update, delete: if false;
    }

    match /receitas/{docId} {
      // Apenas o paciente dono da receita pode ler
      allow read: if request.auth != null && request.auth.uid == resource.data.patientId;

      // Apenas médicos autenticados podem criar
      allow create: if request.auth != null &&
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'doctor';

      allow update, delete: if false;
    }

    match /LabResults/{resultId} {
      allow read: if isPatient() && request.auth.uid == resource.data.patientId;
      allow read, write: if isDoctor() || isAdmin();
      allow delete: if isAdmin();
    }

    // Catch-all bloqueando qualquer acesso não previsto
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
