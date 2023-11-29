# Planning

## React Components
List the various react components and functionalities

* Map widget
  * ~~Contains leaflet.js map~~
  * Possible functionality for plotting Trimet stations, Biketown bikes, and Popular destinations
    * Implement layer states for each of those widgets
    * Implement map layers on MapWidget
* Weather widget
  * ~~Come up with a simple weather dashboard using api~~
  * ~~This widget should report rain possibility and sunrise/sunset as a react state (to use in the top bar component)~~
* Trimet Widget
  * Use trimet api to get nearest station data and other info
  * Should report nearest stations as react state to use for plotting on map
* Biketown widget
  * Use biketown api to get nearest available bikes
  * Should report location data as react state for plotting on map
* Events/PopularSpots widget
  * ~~should either show events or popular spots nearby~~
  * ~~should report locations as react state for plotting on map~~
* Top Bar Component
  * This will contain several functional parts
    - ~~Sunrise/Sunset~~
    - ~~Name of the Destination~~
    - Air Quality
    - Umbrella Reminder