import React from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "../components/HeroSection.css";
import { Button } from "../components/Button";
import { Amplify } from "aws-amplify";
import awsExports from "../aws-exports";
import { useAuth } from "../AuthContext";

Amplify.configure(awsExports);

const LoginRegister = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  return (
    <Authenticator>
      {({ signOut, user }) => {
        // Update the global auth state when the user logs in
        if (!isAuthenticated) {
          setIsAuthenticated(true);
        }

        return (
          <div className="hero-container2">
            <h1>Hello!</h1>
            <p>{user.username}</p>
            <p>You have successfully logged in. Please explore our services!</p>
            <div style={{ marginBottom: "200px" }}>
              {/* This is a vertical spacer */}
            </div>
            <div className="hero-btns">
              <Button
                className="btns"
                buttonStyle="btn--outline"
                buttonSize="btn--large"
                onClick={() => {
                  signOut();
                  setIsAuthenticated(false); // Reset the auth state on sign out
                  //Refresh page : So that on NavBar.js the logout button changes to login in future useState change or dynamic check to do so.
                  window.location.reload();
                }}
              >
                Sign Out
              </Button>
            </div>
          </div>
        );
      }}
    </Authenticator>
  );
};

export default LoginRegister;
