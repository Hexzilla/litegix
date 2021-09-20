module.exports = {
  install_script: function (token) {
    const url = process.env.SERVER_URL;
    return `export DEBIAN_FRONTEND=noninteractive; echo 'Acquire::ForceIPv4 \"true\";' | tee /etc/apt/apt.conf.d/99force-ipv4; apt-get update; apt-get install curl netcat-openbsd -y; curl -4 --silent --location ${url}/install/agent/script/${token} | bash -; export DEBIAN_FRONTEND=newt`;
  },
};
