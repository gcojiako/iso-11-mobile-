import { getDatabase, ref, set, get } from '@firebase/database';

export default async function getUser ({uid}){
    const dbRef = ref(getDatabase(), `users/${uid}`);
    const userSnapshot = await get(dbRef);
    const userData = userSnapshot.val();
    return userData;
  }