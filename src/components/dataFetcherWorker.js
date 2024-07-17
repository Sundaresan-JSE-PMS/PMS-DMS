self.onmessage = async function (e) {
  const { url } = e.data;
  let result = [];

  try {
      for (let i = 0; i < url.length; i++) {
          const response = await fetch(url[i], {
              credentials: "omit",
              method: "GET",
              headers: {
                  Authorization: "Basic " + btoa("fhiruser:change-password"),
              },
          });
          const data = await response.json();
          if (data.total !== 0) {
              result = result.concat(data.entry.map((val) => val));
          }
      }
      postMessage({ success: true, data: result.reverse() });
  } catch (error) {
      postMessage({ success: false, error: error.message });
  }
};
