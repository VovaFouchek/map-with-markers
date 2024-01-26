import MapContainer from '../MapContainer';
// import addQuestMarker from '../FirebaseService';

const Main = () => {
  // const handleMapClick = (location: google.maps.LatLngLiteral) => {
  // const timestamp = Date.now();
  // const questNumber = markers.length + 1;
  // addQuestMarker(location, timestamp, questNumber);
  // };

  return (
    <div>
      {/* <MapContainerTest onMapClick={handleMapClick} /> */}
      <MapContainer />
    </div>
  );
};

export default Main;
