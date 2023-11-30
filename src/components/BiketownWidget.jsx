import React, { useState, useEffect } from "react";
import './TrimetWidget.css'
import { Card, List } from 'semantic-ui-react'

// Function to calculate the distance between two coordinates using the Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3958.8; // Radius of the Earth in miles
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance
    return distance;
}

const useClosestBikes = (userLat, userLon, bikes) => {
    const [closestBikes, setClosestBikes] = useState([]);

    useEffect(() => {
        if (!userLat || !userLon || !bikes) return;

        const sortedBikes = bikes.sort((a, b) => {
            const distanceA = calculateDistance(userLat, userLon, a.lat, a.lon);
            const distanceB = calculateDistance(userLat, userLon, b.lat, b.lon);
            return distanceA - distanceB;
        });

        setClosestBikes(sortedBikes.slice(0, 5));
    }, [userLat, userLon, bikes]);

    return closestBikes;
};

const BiketownWidget = ({ updateLayer, coordinates }) => {
    const userLat = coordinates[0];
    const userLon = coordinates[1];
    const [bikedata, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    "https://gbfs.lyft.com/gbfs/2.3/pdx/en/free_bike_status.json"
                );
                const data = await response.json();
                setData(data.data);
            } catch (error) {
                console.error("Error fetching Biketown data:", error);
            }
        };

        fetchData();
    }, []);

    const closestBikes = useClosestBikes(userLat, userLon, bikedata.bikes);

    useEffect(() => {
        updateLayerState(closestBikes);
    }, [closestBikes]);

    function updateLayerState(closestBikes) {
        const bikeCoordinates = closestBikes.map(bike => [bike.lat, bike.lon]);
        console.log('bike coords ',bikeCoordinates);
        updateLayer(bikeCoordinates);
    }

    return (
        <Card className="trimet-container">
            <Card.Content className='card-header'>
                <Card.Header>Biketown</Card.Header>
            </Card.Content>
            <Card.Content className='card-content-area card-description'>
                <List divided relaxed>
                    {closestBikes.map((bike) => (
                        <List.Item key={bike.bike_id}>
                            <List.Content>
                                <List.Header>Bike ID: {bike.bike_id.slice(-5)}</List.Header>
                                <List.Description>
                                    Distance:{" "}
                                    {(
                                        calculateDistance(userLat, userLon, bike.lat, bike.lon) * 0.621371
                                    ).toFixed(2)}{" "}
                                    miles
                                </List.Description>
                            </List.Content>
                        </List.Item>
                    ))}
                </List>
            </Card.Content>
        </Card>
    );
};

export default BiketownWidget;
