import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';

interface Props {
  username: string;
  replyText: string;
  logoUrl: string;
  updatedDate?: Date;
}

export const MessageReplyEmail = ({
  username,
  replyText,
  logoUrl
}: Props) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>This is a reply to Your email</Preview>
        <Container style={container}>
          <Section style={logo}>
            <Img
              width={114}
              src={logoUrl}
              alt="Logo"
              style={logoImg}
            />
          </Section>
          <Section style={sectionsBorders}>
            <Row>
              <Column style={sectionBorder} />
              <Column style={sectionCenter} />
              <Column style={sectionBorder} />
            </Row>
          </Section>
          <Section style={content}>
            <Text style={paragraph}>Hi {username},</Text>
            <Text style={paragraph}>
              {replyText}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};


export default MessageReplyEmail;

const fontFamily = 'HelveticaNeue,Helvetica,Arial,sans-serif';

const main = {
  backgroundColor: '#efeef1',
  fontFamily,
};

const paragraph = {
  lineHeight: 1.5,
  fontSize: 14,
};

const container = {
  maxWidth: '580px',
  margin: '30px auto',
  backgroundColor: '#ffffff',
};

const content = {
  padding: '5px 20px 10px 20px',
};

const logo = {
  padding: 30,
};

const logoImg = {
  margin: '0 auto',
};

const sectionsBorders = {
  width: '100%',
};

const sectionBorder = {
  borderBottom: '1px solid rgb(238,238,238)',
  width: '249px',
};

const sectionCenter = {
  borderBottom: '1px solid rgb(145,71,255)',
  width: '102px',
};
