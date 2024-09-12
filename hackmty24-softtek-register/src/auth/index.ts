import { auth, fs } from "@/firebase";
import { SignStatus } from "@/types/login";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
  UserCredential,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

/**
 * Creates a user document in Firestore
 * @param uid User's UID
 * @param email User's email
 * @param photoUrl User's photo URL (optional)
 */
const createTeamDocument = async (
  uid: string,
  email: string
) => {
  try {
    // doc id es el uid del usuario
    await setDoc(doc(fs, "users", uid), {
      uid,
      email
    });
  } catch (error) {
    console.error("Error creating team document:", error);
    throw error;
  }
};

/**
 * Authenticates a user with email and password
 * @param email User's email address
 * @param password User's password
 * @returns An object indicating the success of the login attempt
 */
export const doSignIn = async (
  email: string,
  password: string
): Promise<{ success: boolean; message?: string; user?: User }> => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const req = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: req.user };
  } catch (error) {
    console.error("Email/Password sign-in error:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};

/**
 * Performs login with a Google account
 * @returns An object indicating the success of the login attempt, and user data if successful
 */
export const doSignInGoogle = async (): Promise<{
  success: boolean;
  message?: string;
  user?: User;
}> => {
  try {
    const googleProvider = new GoogleAuthProvider();
    await setPersistence(auth, browserLocalPersistence);
    const result = await signInWithPopup(auth, googleProvider);
    console.log("User photo created:", result.user.photoURL);
    await createTeamDocument(
      result.user.uid,
      result.user.email!
    );
    return {
      success: true,
      user: result.user,
    };
  } catch (error) {
    console.error("Google sign-in error:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};


export const doSignInGithub = async (): Promise<{
  success: boolean;
  message?: string;
  user?: UserCredential;
}> => {
  try {
    const githubProvider = new GithubAuthProvider();

    await setPersistence(auth, browserLocalPersistence);

    const result = await signInWithPopup(auth, githubProvider);
    console.log("result of user credential:", result);
    console.log("User photo created:", result.user.photoURL);
    await createTeamDocument(
      result.user.uid,
      result.user.email!

    );
    return {
      success: true,
      user: result,
    };
  } catch {
    return {
      success: false,
      message: "Error authenticating user",
    };
  }
};

/**
 * Creates a new user with email and password and adds them to Firestore
 * @param email email
 * @param password password
 * @param photoUrl optional photo URL
 * @returns Status of the user creation attempt
 */
export const doSignUp = async (
  email: string,
  password: string,
  photoUrl: string = ""
): Promise<SignStatus> => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await createTeamDocument(userCredential.user.uid, userCredential.user.email!);
    console.log("User photo created:", userCredential.user.photoURL);
    return { status: "success", message: "true", user: userCredential.user };
  } catch (error) {
    console.error("Sign-up error:", error);
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      user: null,
    };
  }
};

/**
 * Logs out the current user
 */
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (e) {
    console.error("Error logging out:", e);
    // TODO: mostrar toast si falla el sign out
  }
};
