let imageUrl = null;
function onSignIn(googleUser) {
    const id_token = googleUser.getAuthResponse().id_token;
    imageUrl = googleUser.getBasicProfile().getImageUrl();
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'googleLogin');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.addEventListener('load', onLoginResponse);
    xhr.addEventListener('error', onNetworkError);
    xhr.send('idToken=' + id_token);
}