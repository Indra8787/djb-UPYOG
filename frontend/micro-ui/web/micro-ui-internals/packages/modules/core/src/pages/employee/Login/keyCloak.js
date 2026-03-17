import Keycloak from "keycloak-js";

let _kc;

export const initKeycloak = async () => {
  if (_kc) return _kc;

  _kc = new Keycloak({
    url: "https://dev-djb.nitcon.in/keycloak",
    realm: "DL",
    clientId: "upyog",
    // redirectUri: window.location.origin,
  });

  const authenticated = await _kc.init({
    onLoad: "check-sso",
    pkceMethod: "S256",
    checkLoginIframe: false,
  });

  if (!authenticated) {
    await _kc.login({
      redirectUri: window.location.href,
    });
  }

  return _kc;
};

export const getKeycloak = () => _kc;
