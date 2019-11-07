const wx_xml_template = `
    <xml>
         <ToUserName><![CDATA[<%-toUsername%>]]></ToUserName>
         <FromUserName><![CDATA[<%-fromUsername%>]]></FromUserName>
         <CreateTime><%=createTime%></CreateTime>
         <MsgType><![CDATA[<%=msgType%>]]></MsgType>
         <% if (msgType === 'news') { %>
         <ArticleCount><%=content.length%></ArticleCount>
         <Articles>
         <% content.forEach(function(item){ %>
         <item>
         <Title><![CDATA[<%-item.title%>]]></Title>
         <Description><![CDATA[<%-item.description%>]]></Description>
         <PicUrl><![CDATA[<%-item.picUrl || item.picurl || item.pic || item.thumb_url %>]]></PicUrl>
         <Url><![CDATA[<%-item.url%>]]></Url>
         </item>
         <% }); %>
         </Articles>
         <% } else if (msgType === 'music') { %>
         <Music>
         <Title><![CDATA[<%-content.title%>]]></Title>
         <Description><![CDATA[<%-content.description%>]]></Description>
         <MusicUrl><![CDATA[<%-content.musicUrl || content.url %>]]></MusicUrl>
         <HQMusicUrl><![CDATA[<%-content.hqMusicUrl || content.hqUrl %>]]></HQMusicUrl>
         </Music>
         <% } else if (msgType === 'voice') { %>
         <Voice>
         <MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>
         </Voice>
         <% } else if (msgType === 'image') { %>
         <Image>
         <MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>
         </Image>
         <% } else if (msgType === 'video') { %>
         <Video>
         <MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>
         <Title><![CDATA[<%-content.title%>]]></Title>
         <Description><![CDATA[<%-content.description%>]]></Description>
         </Video>
         <% } else { %>
         <Content><![CDATA[<%-content%>]]></Content>
         <% } %>
    </xml>
`;

module.exports = wx_xml_template;

