package com.ecommerceearn.app.ui.pages

import android.view.ViewGroup
import android.widget.FrameLayout
import androidx.annotation.OptIn
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.media3.common.MediaItem
import androidx.media3.common.Player
import androidx.media3.common.util.UnstableApi
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.ui.AspectRatioFrameLayout
import androidx.media3.ui.PlayerView
import coil.compose.AsyncImage
import com.ecommerceearn.app.data.manager.NavigationManager
import com.ecommerceearn.app.data.model.Story
import com.ecommerceearn.app.data.model.StoryMediaType
import kotlinx.coroutines.launch

@kotlin.OptIn(ExperimentalFoundationApi::class)
@Composable
fun StoryView(stories: List<Story> = emptyList()) {
    if (stories.isEmpty()) {
        Box(modifier = Modifier.fillMaxSize().background(Color.Black), contentAlignment = Alignment.Center) {
            Text("No Stories", color = Color.White)
            IconButton(onClick = { NavigationManager.goBack() }, modifier = Modifier.align(Alignment.TopEnd).padding(16.dp)) {
                Icon(Icons.Default.Close, contentDescription = "Close", tint = Color.White)
            }
        }
        return
    }

    val pagerState = rememberPagerState(pageCount = { stories.size })
    val coroutineScope = rememberCoroutineScope()
    var isPaused by remember { mutableStateOf(false) }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black)
    ) {
        HorizontalPager(
            state = pagerState,
            modifier = Modifier.fillMaxSize()
        ) { page ->
            val story = stories[page]
            val isCurrentPage = pagerState.currentPage == page

            StoryScreen(
                story = story,
                isCurrentPage = isCurrentPage,
                isPaused = isPaused,
                onPauseToggle = { isPaused = it },
                onNext = {
                    coroutineScope.launch {
                        if (pagerState.currentPage < stories.size - 1) {
                            pagerState.animateScrollToPage(pagerState.currentPage + 1)
                        } else {
                            NavigationManager.goBack() 
                        }
                    }
                },
                onPrevious = {
                    coroutineScope.launch {
                        if (pagerState.currentPage > 0) {
                            pagerState.animateScrollToPage(pagerState.currentPage - 1)
                        }
                    }
                }
            )
        }
    }
}

@OptIn(UnstableApi::class)
@Composable
fun StoryScreen(
    story: Story,
    isCurrentPage: Boolean,
    isPaused: Boolean,
    onPauseToggle: (Boolean) -> Unit,
    onNext: () -> Unit,
    onPrevious: () -> Unit
) {
    val progress = remember { Animatable(0f) }
    val durationMillis = (story.duration ?: 5.0).times(1000).toInt()
    
    val context = LocalContext.current
    val exoPlayer = remember {
        ExoPlayer.Builder(context).build().apply {
            repeatMode = Player.REPEAT_MODE_OFF
            playWhenReady = true
        }
    }

    DisposableEffect(story.mediaUrl) {
        if (story.mediaType == StoryMediaType.video) {
            val mediaItem = MediaItem.fromUri(story.mediaUrl)
            exoPlayer.setMediaItem(mediaItem)
            exoPlayer.prepare()
        }
        onDispose { exoPlayer.release() }
    }

    LaunchedEffect(isCurrentPage, isPaused) {
        if (isCurrentPage) {
            if (!isPaused) {
                if (story.mediaType == StoryMediaType.video) exoPlayer.play()
                progress.animateTo(
                    targetValue = 1f,
                    animationSpec = tween(
                        durationMillis = (durationMillis * (1f - progress.value)).toInt(),
                        easing = LinearEasing
                    )
                )
                onNext()
            } else {
                if (story.mediaType == StoryMediaType.video) exoPlayer.pause()
                progress.stop()
            }
        } else {
            if (story.mediaType == StoryMediaType.video) exoPlayer.pause()
            progress.snapTo(0f)
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .pointerInput(Unit) {
                detectTapGestures(
                    onPress = {
                        onPauseToggle(true)
                        tryAwaitRelease()
                        onPauseToggle(false)
                    },
                    onTap = { offset ->
                        if (offset.x < size.width * 0.3f) {
                            onPrevious()
                        } else {
                            onNext()
                        }
                    }
                )
            }
    ) {
        // Media Layer
        if (story.mediaType == StoryMediaType.image) {
            AsyncImage(
                model = story.mediaUrl,
                contentDescription = "Story Media",
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize()
            )
        } else {
            AndroidView(
                factory = { ctx ->
                    PlayerView(ctx).apply {
                        player = exoPlayer
                        useController = false
                        resizeMode = AspectRatioFrameLayout.RESIZE_MODE_ZOOM
                        layoutParams = FrameLayout.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.MATCH_PARENT
                        )
                    }
                },
                modifier = Modifier.fillMaxSize()
            )
        }

        // Overlay gradient (top & bottom)
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    androidx.compose.ui.graphics.Brush.verticalGradient(
                        0.0f to Color.Black.copy(alpha = 0.5f),
                        0.2f to Color.Transparent,
                        0.8f to Color.Transparent,
                        1.0f to Color.Black.copy(alpha = 0.6f)
                    )
                )
        )

        // Progress Bar & Header
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 48.dp, start = 16.dp, end = 16.dp)
        ) {
            LinearProgressIndicator(
                progress = { progress.value },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(2.dp)
                    .clip(RoundedCornerShape(1.dp)),
                color = Color.White,
                trackColor = Color.White.copy(alpha = 0.3f)
            )

            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .clip(CircleShape)
                            .background(Color.Gray),
                        contentAlignment = Alignment.Center
                    ) {
                        if (story.userProfileImage != null) {
                            AsyncImage(
                                model = story.userProfileImage,
                                contentDescription = "Profile",
                                modifier = Modifier.fillMaxSize(),
                                contentScale = ContentScale.Crop
                            )
                        } else {
                            Icon(Icons.Default.Person, contentDescription = null, tint = Color.White)
                        }
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = story.userName,
                        color = Color.White,
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp
                    )
                }

                IconButton(onClick = { NavigationManager.goBack() }) {
                    Icon(Icons.Default.Close, contentDescription = "Close", tint = Color.White)
                }
            }
        }
    }
}
