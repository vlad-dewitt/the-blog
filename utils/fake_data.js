const bcrypt = require('bcryptjs');
const { AvatarGenerator } = require('random-avatar-generator');
const randomAvatar = () => new AvatarGenerator().generateRandomAvatar();

const User = require('../models/user');
const Feed = require('../models/feed');



const fake_users = [
  {
    username: 'billy_1999',
    password: 'pbilly',
    sessions: [],
    profile: {
      avatar: randomAvatar(),
      full_name: 'Billy Brown'
    }
  },
  {
    username: 'morty_hog',
    password: 'pmorty',
    sessions: [],
    profile: {
      avatar: randomAvatar(),
      full_name: ''
    }
  },
  {
    username: 'elliot',
    password: 'pelliot',
    sessions: [],
    profile: {
      avatar: randomAvatar(),
      full_name: 'Elliot'
    }
  },
  {
    username: 'karina.blue',
    password: 'pkarina',
    sessions: [],
    profile: {
      avatar: randomAvatar(),
      full_name: 'Karina Blue'
    }
  }
]

const fake_posts = [
  {
    date_created: new Date(2020, 0, 19, 12, 8, 32),
    author: 'billy_1999',
    text: `Bringing so sociable felicity supplied mr. September suspicion far him two acuteness perfectly. Covered as an examine so regular of. Ye astonished friendship remarkably no. Window admire matter praise you bed whence. Delivered ye sportsmen zealously arranging frankness estimable as. Nay any article enabled musical shyness yet sixteen yet blushes. Entire its the did figure wonder off.
    Behaviour we improving at something to. Evil true high lady roof men had open. To projection considered it precaution an melancholy or. Wound young you thing worse along being ham. Dissimilar of favourable solicitude if sympathize middletons at. Forfeited up if disposing perfectly in an eagerness perceived necessary. Belonging sir curiosity discovery extremity yet forfeited prevailed own off. Travelling by introduced of mr terminated. Knew as miss my high hope quit. In curiosity shameless dependent knowledge up.`,
    comments: []
  },
  {
    date_created: new Date(2020, 0, 22, 19, 45, 43),
    author: 'morty_hog',
    text: `On on produce colonel pointed. Just four sold need over how any. In to september suspicion determine he prevailed admitting. On adapted an as affixed limited on. Giving cousin warmly things no spring mr be abroad. Relation breeding be as repeated strictly followed margaret. One gravity son brought shyness waiting regular led ham.`,
    comments: []
  },
  {
    date_created: new Date(2020, 0, 24, 14, 54, 20),
    author: 'elliot',
    text: `Unpacked now declared put you confined daughter improved. Celebrated imprudence few interested especially reasonable off one. Wonder bed elinor family secure met.`,
    comments: []
  },
  {
    date_created: new Date(2020, 0, 25, 15, 23, 12),
    author: 'karina.blue',
    text: `Endeavor bachelor but add eat pleasure doubtful sociable. Age forming covered you entered the examine. Blessing scarcely confined her contempt wondered shy. Dashwoods contented sportsmen at up no convinced cordially affection. Am so continued resembled frankness disposing engrossed dashwoods. Earnest greater on no observe fortune norland. Hunted mrs ham wishes stairs. Continued he as so breakfast shameless. All men drew its post knew. Of talking of calling however civilly wishing resolve.
    Not far stuff she think the jokes. Going as by do known noise he wrote round leave. Warmly put branch people narrow see. Winding its waiting yet parlors married own feeling. Marry fruit do spite jokes an times. Whether at it unknown warrant herself winding if. Him same none name sake had post love. An busy feel form hand am up help. Parties it brother amongst an fortune of. Twenty behind wicket why age now itself ten.`,
    comments: []
  },
]



module.exports = async () => {
  try {
    const users_count = await User.find().countDocuments();
    const posts_count = await Feed.find().countDocuments();

    if (!users_count) {
      for (let i in fake_users) {
        const fake_user = fake_users[i];
        const encrypted_password = await bcrypt.hash(fake_user.password, 12);

        const user = new User({
          ...fake_user,
          password: encrypted_password
        });

        await user.save()
      }

      console.log("[[[ 4 fake users created ]]]");
    }

    if (!posts_count) {
      for (let i in fake_posts) {
        const fake_post = fake_posts[i];
        const post = new Feed(fake_post);
        await post.save()
      }

      console.log("[[[ 4 fake posts created ]]]");
    }
  } catch (err) {
    throw new Error("[[[ Fake data creation error ]]]", err);
  }
}
