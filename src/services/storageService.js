import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadProfileImage = async (userId, file) => {
  const fileRef = ref(storage, `profiles/${userId}`);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
};