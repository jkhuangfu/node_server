const txt = `
    <xml>
      <ToUserName><![CDATA[<%-toUsername%>]]></ToUserName>
      <FromUserName><![CDATA[<%-fromUsername%>]]></FromUserName>
      <CreateTime><%=createTime%></CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[你好]]></Content>
    </xml>
`;

const image = `
    <xml>
      <ToUserName><![CDATA[<%-toUsername%>]]></ToUserName>
      <FromUserName><![CDATA[<%-fromUsername%>]]></FromUserName>
      <CreateTime><%=createTime%></CreateTime>
      <MsgType><![CDATA[image]]></MsgType>
      <Image>
        <MediaId><![CDATA[media_id]]></MediaId>
      </Image>
    </xml>
`;

const voice = `
    <xml>
      <ToUserName><![CDATA[<%-toUsername%>]]></ToUserName>
      <FromUserName><![CDATA[<%-fromUsername%>]]></FromUserName>
      <CreateTime><%=createTime%></CreateTime>
      <MsgType><![CDATA[voice]]></MsgType>
      <Voice>
        <MediaId><![CDATA[media_id]]></MediaId>
      </Voice>
    </xml>
`;

const video = `
    <xml>
      <ToUserName><![CDATA[<%-toUsername%>]]></ToUserName>
      <FromUserName><![CDATA[<%-fromUsername%>]]></FromUserName>
      <CreateTime><%=createTime%></CreateTime>
      <MsgType><![CDATA[video]]></MsgType>
      <Video>
        <MediaId><![CDATA[media_id]]></MediaId>
        <Title><![CDATA[title]]></Title>
        <Description><![CDATA[description]]></Description>
      </Video>
    </xml>
`;

const music = `
    <xml>
      <ToUserName><![CDATA[<%-toUsername%>]]></ToUserName>
      <FromUserName><![CDATA[<%-fromUsername%>]]></FromUserName>
      <CreateTime><%=createTime%></CreateTime>
      <MsgType><![CDATA[music]]></MsgType>
      <Music>
        <Title><![CDATA[TITLE]]></Title>
        <Description><![CDATA[DESCRIPTION]]></Description>
        <MusicUrl><![CDATA[MUSIC_Url]]></MusicUrl>
        <HQMusicUrl><![CDATA[HQ_MUSIC_Url]]></HQMusicUrl>
        <ThumbMediaId><![CDATA[media_id]]></ThumbMediaId>
      </Music>
    </xml>
`;

const news = `
    <xml>
      <ToUserName><![CDATA[<%-toUsername%>]]></ToUserName>
      <FromUserName><![CDATA[<%-fromUsername%>]]></FromUserName>
      <CreateTime><%=createTime%></CreateTime>
      <MsgType><![CDATA[news]]></MsgType>
      <ArticleCount>1</ArticleCount>
      <Articles>
        <item>
          <Title><![CDATA[title1]]></Title>
          <Description><![CDATA[description1]]></Description>
          <PicUrl><![CDATA[picurl]]></PicUrl>
          <Url><![CDATA[url]]></Url>
        </item>
      </Articles>
    </xml>
`;

module.exports = {
    txt, music, news, voice, image, video
};

