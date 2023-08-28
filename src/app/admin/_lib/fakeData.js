const devices = [
  {
    device: "desktop",
    resolution: "1920 x 1080"
  },
  {
    device: "desktop",
    resolution: "1366 x 768"
  },
  {
    device: "desktop",
    resolution: "1280 x 720"
  },
  {
    device: "tablet",
    resolution: "768 x 1024"
  },
  {
    device: "tablet",
    resolution: "600 x 1024"
  },
  {
    device: "tablet",
    resolution: "480 x 800"
  },
  {
    device: "mobile",
    resolution: "360 x 640"
  },
  {
    device: "mobile",
    resolution: "320 x 568"
  },
  {
    device: "mobile",
    resolution: "375 x 667"
  }
]

const browsers = ["Chrome", "Firefox", "Safari", "Edge", "Opera"]

// export function generateFakeData(dateStr, period) {
//   const fakeData = new Map();

//   const startDate = new Date(dateStr);
//   for (let i = 0; i < period; i++) {
//     const currentDate = new Date(startDate);
//     currentDate.setDate(startDate.getDate() - i);
//     const randomSessions = Math.floor(Math.random() * 150); // Generate random session count
//     fakeData.set(str(currentDate), randomSessions);
//   }

//   return fakeData
// }

// export function generateFakePercentageData(dateStr, period) {
//   const fakeData = new Map();

//   const startDate = new Date(dateStr);
//   for (let i = 0; i < period; i++) {
//     const currentDate = new Date(startDate);
//     currentDate.setDate(startDate.getDate() - i);
//     const randomSessions = Math.floor(Math.random() * 100); // Generate random session count
//     fakeData.set(str(currentDate), randomSessions);
//   }

//   return fakeData
// }

export function fakeSessionsGenerator(period) {

  const sessions = [],
        currentDate = new Date()

  const sessionCountsMedium = 30,
        sessionCountsStdDev = 5,
        sessionCounts = generateRandomPositiveArrayWithStdDev(sessionCountsMedium, period, sessionCountsStdDev),
        totalSessions = sessionCounts.reduce((acc, val) => acc + val, 0)

  const newUsers = generateRandomOutcome([true, false], [8, 2], totalSessions),
        referrers = generateRandomOutcome(['Instagram', 'Google', 'Qanvast', 'Direct'], [5, 5, 2, 1], totalSessions)

  const eventsPerSessionMedium = 6,
        eventsPerSessionStdDev = 2,
        eventsPerSessionArr = generateRandomPositiveArrayWithStdDev(eventsPerSessionMedium, totalSessions, eventsPerSessionStdDev)

  for (let i = 0; i <= period; i++) {

    const date = new Date()
    date.setDate(currentDate.getDate() - i)
    const sessionPerDay = sessionCounts[i]


    const random = Math.trunc(Math.random() * 9),
          random2 = Math.trunc(Math.random() * 5),
          device = devices[random],
          browser = browsers[random2]

    for (let j = 0; j < sessionPerDay; j++) {

      const newUser = newUsers.shift(),
            referrer = referrers.shift(),
            uid = newUser ? Math.random().toString(36).substring(2, 9) : getRandomItemFromArray(sessions).uid
        
      let eventsPerSession = eventsPerSessionArr.shift()

      if (newUser) {
        eventsPerSession = Math.random() > 0.3 ? eventsPerSession : 1
      } else {
        eventsPerSession = Math.random() > 0.2 ? eventsPerSession : 1
      }

      const { eventsDetails, sessionTime } = generateEvents(eventsPerSession, device, browser)

      sessions.push({
        ...device,
        browser,
        createdAt: date.toISOString(),
        uid,
        newUser,
        referrer,
        events: eventsDetails,
        updatedAt: new Date(Date.parse(date) + sessionTime).toISOString()
      })

    }
    
  }

  return sessions
}

function generateEvents(number, device, browser) {
  const pagesSet1 = ['pageA-version1', 'pageB', 'pageC', 'pageD', 'pageE'],
        pagesSet2 = ['pageA-version2', 'pageB', 'pageC', 'pageD', 'pageE'],
        pagesSet = Math.random() > 0.5 ? pagesSet1 : pagesSet2,
        PossibleEvents = [...pagesSet, 'event1', 'event2', 'event3'],
        eventOutcomeRation = [1,1,1,1,1,1,1,1],
        events = generateRandomOutcome(PossibleEvents, eventOutcomeRation, number, true)

  let sessionTime = 0

  const eventsDetails = [...events, 'leaveSite'].map(event => {
    const timeRange = events.length < 2 ?
          Math.floor(Math.random() * 1000 * 15) : 
          Math.floor(Math.random() * 1000 * 60 * 3)
    let type = 'leaveSite',
        duration = event === 'leaveSite' ? 0 : timeRange


    switch (true) {
      case Boolean(event.startsWith('page')):
        type = 'pageView'
        break
      case Boolean(event.startsWith('event')):
        type = 'event'
        break
    }

    return { ...device, type, event, duration, browser }
  })

  sessionTime += eventsDetails.reduce((acc, val) => acc + val.duration, 0)
  return { eventsDetails, sessionTime }
}

function generateRandomPositiveArrayWithStdDev(medium, length, stdDev) {
  const result = [];

  for (let i = 0; i < length; i++) {
    // with a given medium and standard deviation.
    const randomNum = medium + (randn_bm() * stdDev);

    // Ensure the generated number is positive.
    const positiveNum = Math.max(randomNum, 0);

    // Round the number to an integer (you can adjust this if you want decimals).
    const roundedNum = Math.round(positiveNum);

    // Add the rounded number to the result array.
    result.push(roundedNum);
  }

  return result;
}

// Function to generate random numbers from a normal distribution.
function randn_bm() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function generateRandomOutcome(possibleValues, ratios, length, noRepeat = false) {
  // if (!Array.isArray(possibleValues) || !Array.isArray(ratios) || ratios.length !== possibleValues.length || length <= 0) {
  //   throw new Error("Invalid input parameters");
  // }

  // Calculate the total sum of ratios.
  const totalSum = ratios.reduce((sum, ratio) => sum + ratio, 0);

  // Create an empty array to store the outcome.
  const outcome = [];

  for (let i = 0; i < length; i++) {
    
    let selectedValue = selectValue()

    function selectValue() {
      // Generate a random number between 0 (inclusive) and totalSum (exclusive).
      const randomNum = Math.random() * totalSum;

      // Determine the selected value based on the random number and ratios.
      let cumulativeRatio = 0;
      let selectedValue = null;

      for (let j = 0; j < possibleValues.length; j++) {
        cumulativeRatio += ratios[j];
        if (randomNum < cumulativeRatio) {
          selectedValue = possibleValues[j];
          break;
        }
      }

      return selectedValue
    }

    while (noRepeat && selectedValue === outcome.at(-1)) {
      selectedValue = selectValue()
    }

    // Add the selected value to the outcome array.
    outcome.push(selectedValue);
  }

  // make sure the first value if the first item
  const indexToRemove = outcome.lastIndexOf(true)
  outcome.splice(indexToRemove, 1)
  outcome.unshift(possibleValues[0])

  return outcome;
}

function getRandomItemFromArray(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}