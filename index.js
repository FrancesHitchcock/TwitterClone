import { tweetsData as tweetsFromDataFile } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

// localStorage.clear()

const newTweetsData = JSON.parse(localStorage.getItem("newTweetsData"))

let tweetsData = tweetsFromDataFile

if(newTweetsData){
    tweetsData = newTweetsData
}

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.dataset.openreplybox){
        handleOpenReplyBoxClick(e.target.dataset.openreplybox)
    }
    else if(e.target.dataset.closereplybox){
        handleCloseReplyBoxClick(e.target.dataset.closereplybox)
    }
    else if(e.target.dataset.replybtn){
        handleTweetReplyBtnClick(e.target.dataset.replybtn)
    }
    else if(e.target.dataset.tweetreply){
        handleReplyDeleteBtnClick(e.target.dataset.tweetreply, e.target.dataset.replyindex)
    }
    else if(e.target.dataset.usertweet){
        handleUserTweetDeleteBtnClick(e.target.dataset.usertweet, e.target.dataset.tweetindex)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')

    const repliesContainerArray = document.querySelectorAll('.replies-container')

    const repliesContainerStyles = []

    repliesContainerArray.forEach(function(repliesContainer){
        const isHidden = repliesContainer.classList.contains('hidden')
        repliesContainerStyles.push(isHidden)
    })

    localStorage.setItem("isHiddenArray", JSON.stringify(repliesContainerStyles))
}

function handleOpenReplyBoxClick(tweetId){
    document.getElementById(`user-reply-${tweetId}`).classList.add('block')
    document.getElementById(`user-reply-${tweetId}`).classList.remove('hidden')

    localStorage.setItem(`replyBoxVisibility-${tweetId}`, JSON.stringify("block"))
}

function handleCloseReplyBoxClick(tweetId){
    const userReplyContainer = document.getElementById(`user-reply-${tweetId}`)
    userReplyContainer.classList.add('hidden')
    userReplyContainer.classList.remove('block')
    document.getElementById(`reply-area-${tweetId}`).value = ""

    localStorage.setItem(`replyBoxVisibility-${tweetId}`, JSON.stringify("hidden"))   
}

function handleTweetReplyBtnClick(tweetId){
    const replyTweetText = document.getElementById(`reply-area-${tweetId}`).value
    if(replyTweetText){
        const target = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
        })[0]
        target.replies.unshift(
            {
                handle: `@Scrimba`,
                profilePic: `images/scrimbalogo.png`,
                tweetText: `${replyTweetText}`,
            }
        )

        localStorage.setItem(`replyBoxVisibility-${tweetId}`, JSON.stringify("hidden")) 

        render()
    }
    else{
        handleCloseReplyBoxClick(tweetId)
    } 
}

function handleReplyDeleteBtnClick(tweetId, replyIndex){

    const targetTweet = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    targetTweet.replies.splice(replyIndex, 1)

    render()
}

function handleUserTweetDeleteBtnClick(tweetId, tweetIndex){
    const targetTweet = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if(targetTweet.replies.length === 0){
        tweetsData.splice(tweetIndex, 1)
    }

    render()
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }
}

function getFeedHtml(){
    let feedHtml = ``
    let userTweetArrayIndex = 0

    let userReplyDisplayClass = 'hidden'

    const isHiddenArrayFromLocalStorage = JSON.parse(localStorage.getItem("isHiddenArray"))

    let visibilityClassArray = []
    let visibilityArrayIndex = 0

    if(isHiddenArrayFromLocalStorage){
        isHiddenArrayFromLocalStorage.forEach(function(isHidden){
            if(isHidden){
                visibilityClassArray.push(`hidden`)
            }
            else{
                visibilityClassArray.push(``)
            }
        })
    }
    else{
        for (let i = 0; i < tweetsData.length; i++){
            visibilityClassArray.push(`hidden`)
        }   
    }

    tweetsData.forEach(function(tweet){
       
        const localStorageDisplay = JSON.parse(localStorage.getItem(`replyBoxVisibility-${tweet.uuid}`))

        if(localStorageDisplay){
            userReplyDisplayClass = localStorageDisplay
        }

        let likeIconClass = ''
        let repliesHtml = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let replyDeleteBtnVisibilityClass = "hidden"
        
        if(tweet.replies.length > 0){
            let replyArrayIndex = 0

            tweet.replies.forEach(function(reply){
                replyDeleteBtnVisibilityClass = 'hidden'

                if(reply.handle === '@Scrimba'){
                    replyDeleteBtnVisibilityClass = 'inline'
                }

                repliesHtml+=`
                <div class="tweet-reply"> 
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                        <div>
                            <p class="handle">${reply.handle} <i class="fa-solid fa-trash delete-reply-btn ${replyDeleteBtnVisibilityClass}" data-tweetreply="${tweet.uuid}" data-replyindex="${replyArrayIndex++}"></i> </p>
                            <p class="tweet-text">${reply.tweetText}</p>
                        </div>
                    </div>
                </div>
                 `
            })
        }

        let tweetDeleteBtnVisibilityClass = 'hidden'

        if(tweet.handle === '@Scrimba' && tweet.replies.length === 0){
            tweetDeleteBtnVisibilityClass = 'inline'
        }
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>


            <p class="handle">${tweet.handle} <i class="fa-solid fa-trash delete-reply-btn ${tweetDeleteBtnVisibilityClass}" data-usertweet="${tweet.uuid}" data-tweetindex="${userTweetArrayIndex++}"></i> </p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-reply" data-openreplybox="${tweet.uuid}"></i>
                </span>
            </div>   
        </div>            
    </div>


    <div class="user-reply-box ${userReplyDisplayClass}" id="user-reply-${tweet.uuid}">
        <div class="close-reply-container">
            <i class="fa-solid fa-trash close-reply-btn" id="close-reply-${tweet.uuid}" data-closereplybox="${tweet.uuid}"></i> 
        </div>
        <div class="user-reply-main">
            <div class="reply-addresses-container">
                <div class="from-container">
                    <span class="from-text">from</span> <img src="images/scrimbalogo.png" class="profile-pic"> <span class="scrimba-text">@Scrimba</span>
                </div>
                <div class="to-container">
                    <span class="to-text">to</span><span class="to-handle" id="${tweet.uuid}-text">${tweet.handle}</span>
                </div>
            </div>
            <div class="reply-tweet">
                <div>
                    <textarea class="reply-area" placeholder="Reply" id="reply-area-${tweet.uuid}" ></textarea>
                </div>
                <button class="reply-btn" id="reply-btn-${tweet.uuid}" data-replybtn="${tweet.uuid}">Tweet Reply</button>
            </div>
        </div>
    </div>

    <div class="replies-container ${visibilityClassArray[visibilityArrayIndex++]}" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div> 
</div>
`
   })

   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()

    localStorage.setItem("newTweetsData", JSON.stringify(tweetsData))
}

render()

