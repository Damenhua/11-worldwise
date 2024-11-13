const data = {
  cities: [
    {
      cityName: "Lisbon",
      country: "Portugal",
      emoji: "🇵🇹",
      date: "2027-10-31T15:59:59.138Z",
      notes: "My favorite city so far!",
      position: {
        lat: 38.727881642324164,
        lng: -9.140900099907554,
      },
      id: "73930385",
    },
    {
      cityName: "Madrid",
      country: "Spain",
      emoji: "🇪🇸",
      date: "2027-07-15T08:22:53.976Z",
      notes: "",
      position: {
        lat: 40.46635901755316,
        lng: -3.7133789062500004,
      },
      id: "17806751",
    },
    {
      cityName: "Hamburg",
      country: "Germany",
      emoji: "🇩🇪",
      date: "2027-02-12T09:24:11.863Z",
      notes: "Amazing 😃",
      position: {
        lat: 52.53586782505711,
        lng: 13.376933665713324,
      },
      id: "98443197",
    },
  ],
};

export const handler = async function (event, context) {
  const { path } = event;
  const id = event.path.split("/").pop();

  // GET /cities
  if (event.httpMethod === "GET" && path === "/cities") {
    return {
      statusCode: 200,
      body: JSON.stringify(data.cities),
    };
  }

  // GET /cities/:id
  if (event.httpMethod === "GET" && id) {
    const city = data.cities.find((city) => city.id === Number(id));
    return {
      statusCode: city ? 200 : 404,
      body: city ? JSON.stringify(city) : "City not found",
    };
  }

  // POST /cities
  if (event.httpMethod === "POST") {
    const newCity = JSON.parse(event.body);
    newCity.id = Date.now();
    data.cities.push(newCity);
    return {
      statusCode: 201,
      body: JSON.stringify(newCity),
    };
  }

  // DELETE /cities/:id
  if (event.httpMethod === "DELETE" && id) {
    const index = data.cities.findIndex((city) => city.id === Number(id));
    if (index > -1) {
      data.cities.splice(index, 1);
      return { statusCode: 200 };
    }
    return { statusCode: 404 };
  }
};
