import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const storage = getStorage();

export async function uploadLabResult(userId: string, file: File) {
	const storageRef = ref(storage, `lab_results/${userId}/${file.name}`);
	await uploadBytes(storageRef, file);
	return getDownloadURL(storageRef); // retorna a URL pública
}

export async function getLabResultUrl(userId: string, fileName: string) {
	const storageRef = ref(storage, `lab_results/${userId}/${fileName}`);
	return getDownloadURL(storageRef);
}

export async function deleteLabResult(userId: string, fileName: string) {
	const storageRef = ref(storage, `lab_results/${userId}/${fileName}`);
	return deleteObject(storageRef);
}
