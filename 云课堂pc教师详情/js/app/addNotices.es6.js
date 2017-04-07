/*
* @Author: Administrator
* @Date:   2016-10-31 10:22:45
* @Last Modified by:   Administrator
* @Last Modified time: 2016-10-31 11:20:02
*/

'use strict';
var notice =`
<div class="message-one">
    <p class="message-alert"><i></i><span>给${data.data[i].classroom_info.name}发送了通知</span></p>
    <p class="the">${data.data[i].title}</p>
    <p>${data.data[i].content}</p>
    <p class="date">
    <i onclick="playAudio();">
    </i>${record_length}"</p>
    <audio class="noticesAud" src="${audFn(data.data[i].record_url)}" style="display:none;">
    </audio>
    <p class="publish-data">datefn(${data.data[i].publish_at})</p>
</div>
`;
