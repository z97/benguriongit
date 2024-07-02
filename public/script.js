document.addEventListener("DOMContentLoaded", function() {
    fetch("/api/flights")
        .then(response => response.json())
        .then(data => {
            console.log(data); // Log data to inspect the structure
            const departures = document.getElementById('departures');
            const arrivals = document.getElementById('arrivals');

            if (data.departures && data.departures.length > 0) {
                const sortedDepartures = data.departures.sort((a, b) => {
                    const timeA = new Date(a.movement.scheduledTime.utc).getTime();
                    const timeB = new Date(b.movement.scheduledTime.utc).getTime();
                    return timeA - timeB;
                });

                sortedDepartures.forEach(flight => {
                    const flightNumber = flight ? flight.number : 'Unknown';
                    const departureTime = flight ? flight.movement.scheduledTime.local : 'N/A';
                    const departureCity = flight ? flight.movement.airport.name : 'Unknown';
                    const terminal = flight ? flight.movement.terminal : 'Unknown';
                    const status = flight ? flight.status : 'Unknown';

                    const li = document.createElement('li');
                    li.textContent = `${flightNumber} to ${departureCity} | ${departureTime} | Terminal: ${terminal} | Status: ${status}`;
                    departures.appendChild(li);
                });
            } else {
                const li = document.createElement('li');
                li.textContent = 'No departures found';
                departures.appendChild(li);
            }

            if (data.arrivals && data.arrivals.length > 0) {
                const sortedArrivals = data.arrivals.sort((a, b) => {
                    const timeA = new Date(a.movement.scheduledTime.utc).getTime();
                    const timeB = new Date(b.movement.scheduledTime.utc).getTime();
                    return timeA - timeB;
                });

                sortedArrivals.forEach(flight => {
                    const flightNumber = flight ? flight.number : 'Unknown';
                    const arrivalTime = flight ? flight.movement.scheduledTime.local : 'N/A';
                    const arrivalCity = flight ? flight.movement.airport.name : 'Unknown';
                    const status = flight ? flight.status : 'Unknown';

                    const li = document.createElement('li');
                    li.textContent = `${flightNumber} from ${arrivalCity} | ${arrivalTime} | Status: ${status}`;
                    arrivals.appendChild(li);
                });
            } else {
                const li = document.createElement('li');
                li.textContent = 'No arrivals found';
                arrivals.appendChild(li);
            }
        })
        .catch(error => {
            console.error('Error fetching flight data:', error);
            const departures = document.getElementById('departures');
            const arrivals = document.getElementById('arrivals');
            const errorLi = document.createElement('li');
            errorLi.textContent = 'Error fetching flight data';
            departures.appendChild(errorLi);
            arrivals.appendChild(errorLi);
        });
});
