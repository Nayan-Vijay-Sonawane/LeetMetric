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
    const cardStatsContainer = document.querySelector("stats-card");

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

            const targetUrl = "http://leetcode.com/graphql/";
            const myHeaders = new Headers();
            myHeaders.append("content/type", "application/json");

            const graphql = `query userSessionProgress($username: String!) {
            allQuestionsCount {
                difficulty
                count
            }

            matchedUser(username: $username) {
                submitStats {
                    acSubmissionNum {
                        difficulty
                        count
                        submissions
                    }

                    totalSubmissionNum {
                        difficulty
                        count
                        submissions
                    }
                }
            }
        }`;

            if(!response.ok){
                throw new Error("Unable to fetch the data");
                const data = await response.json();
                console.log("Logging data: ", data);
            }
        }
        catch(error){
            statsContainer.innerHTML = `<p>No data Found</p>`;
        }

        finally{
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
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