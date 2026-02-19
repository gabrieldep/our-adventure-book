import {
  Component,
  input,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
  inject,
  ViewChild,
  ElementRef,
  signal,
  HostBinding,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (IFrameAPI: SpotifyIframeApi) => void;
    __spotifyIframeApi?: SpotifyIframeApi;
  }
}

interface SpotifyIframeApi {
  createController: (
    element: HTMLElement,
    options: SpotifyEmbedOptions,
    callback: (EmbedController: SpotifyEmbedController) => void
  ) => void;
}

interface SpotifyEmbedOptions {
  uri?: string;
  width?: string;
  height?: string;
}

interface SpotifyEmbedController {
  loadUri: (uri: string) => void;
  togglePlay: () => void;
  destroy: () => void;
}

@Component({
  selector: 'app-spotify-embed',
  standalone: true,
  templateUrl: './spotify-embed.component.html',
  styleUrl: './spotify-embed.component.css',
})
export class SpotifyEmbedComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);

  /** Spotify URI (e.g. spotify:playlist:xxx or spotify:album:xxx) */
  uri = input.required<string>();
  /** Smaller embed (e.g. for corner placement) */
  compact = input<boolean>(false);

  @ViewChild('embedContainer', { static: false }) embedContainer!: ElementRef<HTMLDivElement>;

  @HostBinding('class.spotify-embed-compact') get isCompact(): boolean {
    return this.compact();
  }

  isReady = signal(false);
  private controller: SpotifyEmbedController | null = null;
  private scriptLoaded = false;

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initEmbed();
    }
  }

  ngOnDestroy(): void {
    if (this.controller && typeof this.controller.destroy === 'function') {
      this.controller.destroy();
    }
    this.controller = null;
  }

  private initEmbed(): void {
    const el = this.embedContainer?.nativeElement;
    if (!el) return;

    const uri = this.uri();
    if (!uri) return;

    const compact = this.compact();
    const options: SpotifyEmbedOptions = {
      uri,
      width: '100%',
      height: compact ? '80' : '152',
    };

    const createController = (IFrameAPI: SpotifyIframeApi) => {
      window.__spotifyIframeApi = IFrameAPI;
      IFrameAPI.createController(el, options, (EmbedController) => {
        this.controller = EmbedController;
        this.isReady.set(true);
      });
    };

    if (window.__spotifyIframeApi) {
      createController(window.__spotifyIframeApi);
      return;
    }

    window.onSpotifyIframeApiReady = createController;

    if (this.scriptLoaded) {
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://open.spotify.com/embed/iframe-api/v1';
    script.async = true;
    script.onload = () => {
      this.scriptLoaded = true;
    };
    document.body.appendChild(script);
  }
}
