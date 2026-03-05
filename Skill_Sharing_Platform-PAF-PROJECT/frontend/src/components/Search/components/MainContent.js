import * as React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import {styled} from '@mui/material/styles';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import {useEffect, useMemo, useState} from "react";
import axios from "axios";
import {Button, CircularProgress} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import {Stack} from "@mui/system";
import {getPostMediaUrl} from "../../../utils/media";

const cardData = [
    {
        img: 'https://picsum.photos/800/450?random=1',
        tag: 'Engineering',
        title: 'Revolutionizing software development with cutting-edge tools',
        description:
            'Our latest engineering tools are designed to streamline workflows and boost productivity. Discover how these innovations are transforming the software development landscape.',
        authors: [
            {name: 'Remy Sharp', avatar: '/static/images/avatar/1.jpg'},
            {name: 'Travis Howard', avatar: '/static/images/avatar/2.jpg'},
        ],
    },
    {
        img: 'https://picsum.photos/800/450?random=2',
        tag: 'Product',
        title: 'Innovative product features that drive success',
        description:
            'Explore the key features of our latest product release that are helping businesses achieve their goals. From user-friendly interfaces to robust functionality, learn why our product stands out.',
        authors: [{name: 'Erica Johns', avatar: '/static/images/avatar/6.jpg'}],
    },
    {
        img: 'https://picsum.photos/800/450?random=3',
        tag: 'Design',
        title: 'Designing for the future: trends and insights',
        description:
            'Stay ahead of the curve with the latest design trends and insights. Our design team shares their expertise on creating intuitive and visually stunning user experiences.',
        authors: [{name: 'Dev 1', avatar: '/static/images/avatar/7.jpg'}],
    },
    {
        img: 'https://picsum.photos/800/450?random=4',
        tag: 'Company',
        title: "Our company's journey: milestones and achievements",
        description:
            "Take a look at our company's journey and the milestones we've achieved along the way. From humble beginnings to industry leader, discover our story of growth and success.",
        authors: [{name: 'Cindy Baker', avatar: '/static/images/avatar/3.jpg'}],
    },
    {
        img: 'https://picsum.photos/800/450?random=45',
        tag: 'Engineering',
        title: 'Pioneering sustainable engineering solutions',
        description:
            "Learn about our commitment to sustainability and the innovative engineering solutions we're implementing to create a greener future. Discover the impact of our eco-friendly initiatives.",
        authors: [
            {name: 'Agnes Walker', avatar: '/static/images/avatar/4.jpg'},
            {name: 'Trevor Henderson', avatar: '/static/images/avatar/5.jpg'},
        ],
    },
    {
        img: 'https://picsum.photos/800/450?random=6',
        tag: 'Product',
        title: 'Maximizing efficiency with our latest product updates',
        description:
            'Our recent product updates are designed to help you maximize efficiency and achieve more. Get a detailed overview of the new features and improvements that can elevate your workflow.',
        authors: [{name: 'Travis Howard', avatar: '/static/images/avatar/2.jpg'}],
    },
];

const SyledCard = styled(Card)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    height: '100%',
    backgroundColor: (theme.vars || theme).palette.background.paper,
    '&:hover': {
        backgroundColor: 'transparent',
        cursor: 'pointer',
    },
    '&:focus-visible': {
        outline: '3px solid',
        outlineColor: 'hsla(210, 98%, 48%, 0.5)',
        outlineOffset: '2px',
    },
}));

const SyledCardContent = styled(CardContent)({
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: 16,
    flexGrow: 1,
    '&:last-child': {
        paddingBottom: 16,
    },
});

const StyledTypography = styled(Typography)({
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
});

function Author({post}) {
    // parse the date
    const date = post?.createdAt ? new Date(post.createdAt) : null;
    const formattedDate = date
        ? date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        : 'Unknown date';

    const avatarUrl = post.user?.image
        ? `http://localhost:8080/images/${post.user.image}`
        : '';

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
            }}
        >
            <Box
                sx={{display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center'}}
            >
                {/* single Avatar for the post’s author */}
                <Avatar
                    alt={post.username}
                    src={avatarUrl}
                    sx={{width: 24, height: 24}}
                />
                <Typography variant="caption">
                    {post.username}
                </Typography>
            </Box>

            <Typography variant="caption">
                {formattedDate}
            </Typography>
        </Box>
    );
}

Author.propTypes = {
    authors: PropTypes.arrayOf(
        PropTypes.shape({
            avatar: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        }),
    ).isRequired,
};

export function Search({value, onChange}) {
    return (
        <FormControl sx={{width: {xs: '100%', md: '25ch'}}} variant="outlined">
            <OutlinedInput
                size="small"
                id="search"
                placeholder="Search…"
                value={value}
                onChange={onChange}
                sx={{flexGrow: 1}}
                startAdornment={
                    <InputAdornment position="start" sx={{color: 'text.primary'}}>
                        <SearchRoundedIcon fontSize="small"/>
                    </InputAdornment>
                }
                inputProps={{
                    'aria-label': 'search',
                }}
            />
        </FormControl>
    );
}

export const isVideoFile = (name) => /\.(mp4|webm|ogg|mov)$/i.test(name);

// A single media element (video or image) ------------------------
export function PostMedia({file, postId, index = 0}) {
    const url = getPostMediaUrl(file, `${postId}-${index}`);
    const video = isVideoFile(file);

    if (video) {
        return (
            <video
                src={url}
                controls
                preload="metadata"
                style={{
                    width: "100%",
                    height: "auto",
                    aspectRatio: "16/9",
                    objectFit: "cover",
                }}
            />
        );
    }

    return (
        <CardMedia
            component="img"
            image={url}
            crossOrigin="use-credentials"
            sx={{
                width: "100%",
                height: {sm: "auto", md: "50%"},
                aspectRatio: {sm: "16/9", md: undefined},
                objectFit: "cover",
            }}
        />
    );
}

export function PostCarousel({mediaFiles, postId}) {
    return (
        <Box sx={{position: "relative"}}>
            <Carousel
                autoPlay={false}
                navButtonsAlwaysVisible
                indicators={false}
                animation="fade"
                navButtonsWrapperProps={{
                    style: {
                        pointerEvents: 'none',
                    },
                }}
                navButtonsProps={{
                    style: {
                        pointerEvents: 'auto',
                    },
                }}
                sx={{
                    "& .CarouselItem": {height: "100%"}
                }}
            >
                {mediaFiles.map((file, i) => (
                    <PostMedia key={i} file={file} postId={postId} index={i}/>
                ))}
            </Carousel>
        </Box>
    );
}

export default function MainContent() {
    const [focusedCardIndex, setFocusedCardIndex] = React.useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const loggedInUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get("http://localhost:8080/posts", {
                    withCredentials: true,
                });
                setPosts(res.data);
                console.log(res.data);
            } catch (err) {
                console.error("Error loading posts", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const res = await axios.get('http://localhost:8080/users', {withCredentials: true});
                setUsers(res.data);
                console.log(res.data);
            } catch (err) {
                console.error('Error loading users', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleFollow = async userId => {
        console.log(userId);
        try {
            const res = await axios.put(
                `http://localhost:8080/users/${userId}/follow`,
                {},
                {withCredentials: true}
            );
            setUsers(us => us.map(u => u.id === userId ? res.data : u));
        } catch (err) {
            console.error('Follow failed', err);
        }
    };

    const handleUnfollow = async userId => {
        console.log(userId);
        try {
            const res = await axios.put(
                `http://localhost:8080/users/${userId}/unfollow`,
                {},
                {withCredentials: true}
            );
            setUsers(us => us.map(u => u.id === userId ? res.data : u));
        } catch (err) {
            console.error('Unfollow failed', err);
        }
    };

    const handleFocus = (index) => {
        setFocusedCardIndex(index);
    };

    const handleBlur = () => {
        setFocusedCardIndex(null);
    };

    const handleClick = (label) => {
        setFilter(label);
    };

    const filteredUsers = useMemo(() => {
        console.log(users)
        const q = searchQuery.trim().toLowerCase();
        return users
            .filter(u => u.id !== loggedInUser?.id)
            .filter(u =>
                !q ||
                u.username.toLowerCase().includes(q) ||
                (u.description || '').toLowerCase().includes(q)
            );
    }, [users, searchQuery, loggedInUser]);

    const filteredPosts = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        let byType = posts;
        if (filter === 'Image Posts') {
            byType = posts.filter(p =>
                p.mediaFiles?.some(f => !isVideoFile(f))
            );
        } else if (filter === 'Video Posts') {
            byType = posts.filter(p =>
                p.mediaFiles?.some(f => isVideoFile(f))
            );
        }
        if (!q) return byType;
        return byType.filter(p =>
            (p.title || '').toLowerCase().includes(q) ||
            (p.description || '').toLowerCase().includes(q)
        );
    }, [posts, filter, searchQuery]);

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 4}}>
            <div>
                <Typography variant="h1" gutterBottom>
                    Search
                </Typography>
                <Typography>Stay in the loop with the latest updates</Typography>
            </div>
            <Box
                sx={{
                    display: {xs: 'flex', sm: 'none'},
                    flexDirection: 'row',
                    gap: 1,
                    width: {xs: '100%', md: 'fit-content'},
                    overflow: 'auto',
                }}
            >
                <Search
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: {xs: 'column-reverse', md: 'row'},
                    width: '100%',
                    justifyContent: 'space-between',
                    alignItems: {xs: 'start', md: 'center'},
                    gap: 4,
                    overflow: 'auto',
                }}
            >
                <Box sx={{display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2}}>
                    {['All', 'People', 'Image Posts', 'Video Posts'].map((label) => (
                        <Chip
                            key={label}
                            label={label}
                            clickable
                            onClick={() => handleClick(label)}
                            variant={filter === label ? 'filled' : 'outlined'}
                            color="primary"
                        />
                    ))}
                </Box>
                <Box
                    sx={{
                        display: {xs: 'none', sm: 'flex'},
                        flexDirection: 'row',
                        gap: 1,
                        width: {xs: '100%', md: 'fit-content'},
                        overflow: 'auto',
                    }}
                >
                    <Search
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </Box>
            </Box>

            {filter === 'All' ? (
                <>
                    <Grid container spacing={2}>
                        {loading ? (
                            <Grid item xs={12} sx={{display: 'flex', justifyContent: 'center', py: 6}}>
                                <CircularProgress/>
                            </Grid>
                        ) : (
                            filteredUsers.map(user => {
                                const isFollowing =
                                    Array.isArray(user.followers) &&
                                    user.followers.some(f =>
                                        // if 'f' is an object use f.id, otherwise f itself is the id
                                        (typeof f === 'object' ? f.id : f) === loggedInUser.id
                                    );
                                return (
                                    <Grid item xs={12} sm={6} md={4} key={user.id}>
                                        <Card>
                                            <CardContent>
                                                <Stack alignItems="center" spacing={1}>
                                                    <Avatar
                                                        src={`http://localhost:8080/images/${user.image}`}
                                                        alt={user.username}
                                                        sx={{width: 72, height: 72}}
                                                    />
                                                    <Typography variant="h6">{user.username}</Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {user.description}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        DOB: {new Date(user.dateOfBirth).toLocaleDateString()}
                                                    </Typography>

                                                    <Stack direction="row" spacing={1} sx={{mt: 1}} alignItems="center">
                                                        <Stack direction="row" spacing={1}>
                                                            <Chip label={`${user.followerCount} Followers`}
                                                                  size="small"/>
                                                        </Stack>

                                                        {user.id !== loggedInUser.id && (
                                                            isFollowing ? (
                                                                <Button
                                                                    variant="outlined"
                                                                    size="small"
                                                                    onClick={() => handleUnfollow(user.id)}
                                                                >
                                                                    Unfollow
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    variant="contained"
                                                                    size="small"
                                                                    onClick={() => handleFollow(user.id)}
                                                                >
                                                                    Follow
                                                                </Button>
                                                            )
                                                        )}
                                                    </Stack>
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            })
                        )}
                    </Grid>

                    <Grid container spacing={2} columns={12}>
                        {loading ? (
                            <Grid item xs={12} sx={{display: 'flex', justifyContent: 'center', py: 6}}>
                                <CircularProgress/>
                            </Grid>
                        ) : (
                            filteredPosts.map((post, idx) => (
                                <Grid size={{xs: 12, md: 4}} key={post.id}>
                                    <SyledCard
                                        variant="outlined"
                                        onFocus={() => handleFocus(2)}
                                        onBlur={handleBlur}
                                        tabIndex={0}
                                        className={focusedCardIndex === 2 ? 'Mui-focused' : ''}
                                        sx={{height: '100%'}}
                                    >
                                        {post.mediaFiles?.length > 1 ? (
                                            <PostCarousel mediaFiles={post.mediaFiles} postId={post.id}/>
                                        ) : (
                                            <PostMedia file={post.mediaFiles?.[0]} postId={post.id}/>
                                        )}
                                        <SyledCardContent>
                                            <Typography gutterBottom variant="caption" component="div">
                                                Post #{post.id}
                                            </Typography>
                                            <Typography gutterBottom variant="h6" component="div">
                                                {post.title || 'Untitled'}
                                            </Typography>
                                            <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                                                {post.description ?? 'No description available.'}
                                            </StyledTypography>
                                        </SyledCardContent>
                                        <Author authors={cardData[2].authors} post={post}/>
                                    </SyledCard>
                                </Grid>
                            ))
                        )}
                    </Grid>
                </>
            ) : filter === 'People' ? (
                <Grid container spacing={2}>
                    {loading ? (
                        <Grid item xs={12} sx={{display: 'flex', justifyContent: 'center', py: 6}}>
                            <CircularProgress/>
                        </Grid>
                    ) : (
                        filteredUsers.map(user => {
                            const isFollowing =
                                Array.isArray(user.followers) &&
                                user.followers.some(f =>
                                    // if 'f' is an object use f.id, otherwise f itself is the id
                                    (typeof f === 'object' ? f.id : f) === loggedInUser.id
                                );
                            return (
                                <Grid item xs={12} sm={6} md={4} key={user.id}>
                                    <Card>
                                        <CardContent>
                                            <Stack alignItems="center" spacing={1}>
                                                <Avatar
                                                    src={`http://localhost:8080/images/${user.image}`}
                                                    alt={user.username}
                                                    sx={{width: 72, height: 72}}
                                                />
                                                <Typography variant="h6">{user.username}</Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    {user.description}
                                                </Typography>
                                                <Typography variant="body2">
                                                    DOB: {new Date(user.dateOfBirth).toLocaleDateString()}
                                                </Typography>

                                                <Stack direction="row" spacing={1} sx={{mt: 1}} alignItems="center">
                                                    <Stack direction="row" spacing={1}>
                                                        <Chip label={`${user.followerCount} Followers`} size="small"/>
                                                    </Stack>

                                                    {user.id !== loggedInUser.id && (
                                                        isFollowing ? (
                                                            <Button
                                                                variant="outlined"
                                                                size="small"
                                                                onClick={() => handleUnfollow(user.id)}
                                                            >
                                                                Unfollow
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                variant="contained"
                                                                size="small"
                                                                onClick={() => handleFollow(user.id)}
                                                            >
                                                                Follow
                                                            </Button>
                                                        )
                                                    )}
                                                </Stack>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })
                    )}
                </Grid>
            ) : (
                <Grid container spacing={2} columns={12}>
                    {loading ? (
                        <Grid item xs={12} sx={{display: 'flex', justifyContent: 'center', py: 6}}>
                            <CircularProgress/>
                        </Grid>
                    ) : (
                        filteredPosts.map((post, idx) => (
                            <Grid size={{xs: 12, md: 4}} key={post.id}>
                                <SyledCard
                                    variant="outlined"
                                    onFocus={() => handleFocus(2)}
                                    onBlur={handleBlur}
                                    tabIndex={0}
                                    className={focusedCardIndex === 2 ? 'Mui-focused' : ''}
                                    sx={{height: '100%'}}
                                >
                                    {post.mediaFiles?.length > 1 ? (
                                        <PostCarousel mediaFiles={post.mediaFiles} postId={post.id}/>
                                    ) : (
                                        <PostMedia file={post.mediaFiles?.[0]} postId={post.id}/>
                                    )}
                                    <SyledCardContent>
                                        <Typography gutterBottom variant="caption" component="div">
                                            Post #{post.id}
                                        </Typography>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {post.title || 'Untitled'}
                                        </Typography>
                                        <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                                            {post.description ?? 'No description available.'}
                                        </StyledTypography>
                                    </SyledCardContent>
                                    <Author post={post}/>
                                </SyledCard>
                            </Grid>
                        ))
                    )}
                </Grid>
            )}
        </Box>
    );
}
