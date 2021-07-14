import "./App.css"; //css file
import axios from "axios"; //library for contacting with api
import React, { useState, useEffect } from "react";
import "./searchbox.css"; //css for the whole page
import { MapContainer, TileLayer, Marker, useMap, Popup } from "react-leaflet"; //library to display maps.
//This is a  functional component named location marker where you can move to a particular based on the result we get from ipify api.
function LocationMarker(props) {
  const map = useMap();

  map.flyTo(props.loc);

  return props.loc === null ? null : (
    <Marker position={props.loc}>
      <Popup>You are here</Popup>
    </Marker>
  );
}
//This is a  functional component for location marker where you perform all the core functionalities like calling ipify api and this is the function exported to app.
function App() {
  const [input, setInput] = useState(" "); //to store input
  const [input1, setInput1] = useState("127.0.0.1"); //storing the input once the user cliks on submit icon
  const [ipadress, setIpadress] = useState(""); //state to store ip adress
  const [country, setCountry] = useState("-"); //state to store ip adress
  const [region, setRegion] = useState("-"); //state to store region
  const [timezone, setTimezone] = useState("-"); //state to store timezone
  const [isp, setIsp] = useState("-"); //state to store ISP
  const [position, setPosition] = useState([12.0, 77.0]); //state to set position
  //form submit handler
  function subm(e) {
    e.preventDefault(e);
    console.log(input);
    setInput1(input);
  }
  //when a users enters our website we will get to know his ip address using the below ip.we will call this api using use effect whenever the page reloads.

  useEffect(() => {
    async function getfirst() {
      const res = await axios.get(`https://api.ipify.org?format=json`);
      setInput1(res.data.ip);
    }
    getfirst();
  }, []);
  //whenever a user submits a ip we will enquire it with an api using the below use effect this use effect runs when input1 changes and sets all the state variables.
  useEffect(() => {
    async function getting(x) {
      //calling api
      const res = await axios
        .get(
          `https://geo.ipify.org/api/v1?apiKey=${process.env.REACT_APP_API_KEY}&ipAddress=${x}`
        )
        .catch((err) => {
          if (err.response.status === 422) {
            alert("Wrong IP Addresss");
          }
        });
      if (res != null) {
        //setting all state variables by analysing the json object we get.
        setIpadress(res.data.ip);
        setIsp(res.data.isp);
        setCountry(res.data.location.country);
        setRegion(res.data.location.region);
        setTimezone(res.data.location.timezone);
        setPosition([
          parseFloat(res.data.location.lat),
          parseFloat(res.data.location.lng),
        ]);
      }
    }
    var x = input1;
    getting(x);
  }, [input1]);

  return (
    <div className="container2">
      <div className="container">
        <div className="container1">
          <div className="name">
            <h1 style={{ color: "white" }}>IP ADDRESS TRACKER</h1>
          </div>
          <div className="search-box">
            <input
              type="text"
              style={{ border: "0px" }}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" onClick={subm} className="sub"></button>
          </div>
          <div className="address">
            <div className="box" id="box1">
              <div className="heading">
                <h3 style={{ color: "green" }}>IP address:</h3>
              </div>
              <div className="content">
                <p style={{ fontSize: "1vw" }}>
                  <b>{ipadress}</b>
                </p>
              </div>
            </div>
            <div className="box" id="box2">
              <div className="heading">
                <h3 style={{ color: "green" }}>Location:</h3>
              </div>
              <div className="content" style={{ height: "100%" }}>
                <p
                  style={{
                    fontSize: "1vw",
                    textAlign: "center",
                  }}
                >
                  <b>{(country, region)}</b>
                </p>
              </div>
            </div>
            <div className="box" id="box3">
              <div className="heading">
                <h3 style={{ color: "green" }}>Timezone:</h3>
              </div>
              <div className="content">
                <p style={{ fontSize: "1vw" }}>
                  <b>UTC {timezone}</b>
                </p>
              </div>
            </div>
            <div className="box" id="box4">
              <div className="heading">
                <h3 style={{ color: "green" }}>ISP:</h3>
              </div>
              <div className="content">
                <p style={{ fontSize: "1vw" }}>
                  <b>{isp}</b>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* map code */}
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        style={{
          backgroundColor: "white",
          height: "60vh",
          marginTop: "0%",
          opacity: "0.35",
        }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker loc={position} />
      </MapContainer>
    </div>
  );
}

export default App;
