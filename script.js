document.addEventListener("DOMContentLoaded", function(){

    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".user-stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById('hard-label');
    const cardStatsContainer = document.querySelector(".stats-card");

    // return true or false based on regex
    function validateUsername(username){
        if(username.trim() === ""){
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if(!isMatching){
            alert("Invalid username");
        }
        return isMatching;
    }

    async function fetchUserDetails(username){
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try{

            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            // const response = await fetch(url);

            const proxyUrl = "https://cors-anywhere.herokuapp.com/"
            const targetUrl = "https://leetcode.com/graphql/";
            // concatenated URL
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const graphql = JSON.stringify({

                query: "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
                variables: {username: `${username}`}

                // query: "\n   query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n   count\n  }\n  matchedUser(username: $username) {\n   submitStats {\n  acSubmissionNum difficulty\n   count\n  submissions\n   }\n  totalSubmissionNum  {\n  difficulty\n   count\n   submissions\n   }\n   }\n  }\n}\n   ", 
                // variables: {"username": `${username}`}
            })

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: graphql,
                redirect: "follow"
            };

            // console.log(proxyUrl + targetUrl);   // to check the url is working or not
            const response = await fetch(proxyUrl + targetUrl, requestOptions);
            if(!response.ok){
                throw new Error("Unable to fetch the data");
            }
            const parsedData = await response.json();
            console.log("Logging data: ", parsedData);
            displayUserData(parsedData);
        }
        catch(error){
            statsContainer.innerHTML = `<p>No data Found</p>`;
        }

        finally{
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    function updatedProgress(solved, total, label, circle){
        const progressDegree = (solved/total)*100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }

    function displayUserData(parsedData){
         const totalQues = parsedData.data.allQuestionsCount[0].count;
         const totalEasyQues = parsedData.data.allQuestionsCount[1].count;
         const totalMediumQues = parsedData.data.allQuestionsCount[2].count;
         const totalHardQues = parsedData.data.allQuestionsCount[3].count;

         const solvedTotalQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
         const solvedTotalEasyQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
         const solvedTotalMediumQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
         const solvedTotalHardQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;

         updatedProgress(solvedTotalEasyQues, totalEasyQues, easyLabel, easyProgressCircle);
         updatedProgress(solvedTotalMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle);
         updatedProgress(solvedTotalHardQues, totalHardQues, hardLabel, hardProgressCircle);

         const cardsData = [
            {label: "Overall Submissions", value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[0].submissions },
            {label: "Overall Easy Submissions", value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[1].submissions },
            {label: "Overall Medium Submissions", value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[2].submissions },
            {label: "Overall Hard Submissions", value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[3].submissions },
         ];

         console.log("Cards ka data: ", cardsData);

         cardStatsContainer.innerHTML = cardsData.map(
            data => 
                 `
                    <div class="card">
                    <h4>${data.label}</h4>
                    <p>${data.value}</p>
                    </div>
                `
         ).join("");
         
    }

    // fetch the value after clicking on search button
    searchButton.addEventListener('click', function(){
        const username = usernameInput.value;
        console.log("Logging username: ", username);
        if(validateUsername(username)){
            fetchUserDetails(username);
        }
    })

})