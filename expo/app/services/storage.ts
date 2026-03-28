import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

const OPTIMA_CLOUD_BASE = process.env.EXPO_PUBLIC_RORK_API_BASE_URL || 'https://optima-core-712497593637.us-central1.run.app';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface UploadOptions {
  bucket: 'music' | 'writing' | 'images' | 'tactical' | 'media';
  path: string;
  contentType?: string;
}

export class StorageService {
  static async uploadFile(
    fileUri: string,
    options: UploadOptions
  ): Promise<UploadResult> {
    try {
      console.log('[Storage] Uploading file:', fileUri, options);

      const formData = new FormData();
      
      if (Platform.OS === 'web') {
        const response = await fetch(fileUri);
        const blob = await response.blob();
        formData.append('file', blob);
      } else {
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (!fileInfo.exists) {
          throw new Error('File not found');
        }

        const fileName = fileUri.split('/').pop() || 'file';
        const fileType = options.contentType || 'application/octet-stream';

        formData.append('file', {
          uri: fileUri,
          name: fileName,
          type: fileType,
        } as any);
      }

      formData.append('bucket', options.bucket);
      formData.append('path', options.path);

      const uploadUrl = `${OPTIMA_CLOUD_BASE}/api/storage/upload`;
      console.log('[Storage] Upload URL:', uploadUrl);

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('[Storage] Upload successful:', result);

      return {
        success: true,
        url: result.url,
      };
    } catch (error: any) {
      console.error('[Storage] Upload error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  static async downloadFile(url: string, localPath?: string): Promise<string> {
    try {
      if (Platform.OS === 'web') {
        return url;
      }

      const downloadPath = localPath || `${FileSystem.documentDirectory}${url.split('/').pop()}`;
      
      console.log('[Storage] Downloading file:', url, 'to', downloadPath);

      const result = await FileSystem.downloadAsync(url, downloadPath);
      
      console.log('[Storage] Download successful:', result.uri);
      return result.uri;
    } catch (error: any) {
      console.error('[Storage] Download error:', error);
      throw error;
    }
  }

  static async deleteFile(url: string): Promise<boolean> {
    try {
      console.log('[Storage] Deleting file:', url);

      const response = await fetch(`${OPTIMA_CLOUD_BASE}/api/storage/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
      }

      console.log('[Storage] Delete successful');
      return true;
    } catch (error: any) {
      console.error('[Storage] Delete error:', error);
      return false;
    }
  }

  static getSignedUrl(url: string, expiresIn: number = 3600): string {
    return `${url}?expires=${Date.now() + expiresIn * 1000}`;
  }

  static getCdnUrl(storagePath: string): string {
    return `${OPTIMA_CLOUD_BASE}/cdn/${storagePath}`;
  }
}

export const MusicStorageService = {
  async uploadStem(
    userId: string,
    projectId: string,
    stemId: string,
    fileUri: string
  ): Promise<UploadResult> {
    return StorageService.uploadFile(fileUri, {
      bucket: 'music',
      path: `users/${userId}/projects/${projectId}/stems/${stemId}.wav`,
      contentType: 'audio/wav',
    });
  },

  async uploadMix(
    userId: string,
    projectId: string,
    versionId: string,
    fileUri: string
  ): Promise<UploadResult> {
    return StorageService.uploadFile(fileUri, {
      bucket: 'music',
      path: `users/${userId}/projects/${projectId}/mixed/${versionId}.mp3`,
      contentType: 'audio/mpeg',
    });
  },

  async uploadPreview(
    userId: string,
    projectId: string,
    fileUri: string
  ): Promise<UploadResult> {
    return StorageService.uploadFile(fileUri, {
      bucket: 'music',
      path: `users/${userId}/projects/${projectId}/preview/${projectId}_preview.mp3`,
      contentType: 'audio/mpeg',
    });
  },

  getProjectUrl(userId: string, projectId: string, file: string): string {
    return StorageService.getCdnUrl(`r3al-studio-music/users/${userId}/projects/${projectId}/${file}`);
  },
};

export const WritersStorageService = {
  async saveManuscript(
    userId: string,
    projectId: string,
    content: string,
    versionId: string
  ): Promise<UploadResult> {
    const blob = new Blob([content], { type: 'text/plain' });
    const tempUri = Platform.OS === 'web' 
      ? URL.createObjectURL(blob)
      : `${FileSystem.documentDirectory}temp_manuscript.txt`;

    if (Platform.OS !== 'web') {
      await FileSystem.writeAsStringAsync(tempUri, content);
    }

    return StorageService.uploadFile(tempUri, {
      bucket: 'writing',
      path: `users/${userId}/projects/${projectId}/versions/${versionId}.txt`,
      contentType: 'text/plain',
    });
  },

  async loadManuscript(userId: string, projectId: string, versionId: string): Promise<string> {
    const url = StorageService.getCdnUrl(
      `r3al-writers-guild/users/${userId}/projects/${projectId}/versions/${versionId}.txt`
    );
    
    const response = await fetch(url);
    return response.text();
  },

  getProjectUrl(userId: string, projectId: string): string {
    return StorageService.getCdnUrl(`r3al-writers-guild/users/${userId}/projects/${projectId}/manuscript.txt`);
  },
};

export const ImageStorageService = {
  async uploadGeneration(
    userId: string,
    generationId: string,
    imageBase64: string
  ): Promise<UploadResult> {
    const blob = await fetch(`data:image/png;base64,${imageBase64}`).then(r => r.blob());
    const tempUri = Platform.OS === 'web'
      ? URL.createObjectURL(blob)
      : `${FileSystem.documentDirectory}temp_image.png`;

    if (Platform.OS !== 'web') {
      await FileSystem.writeAsStringAsync(tempUri, imageBase64, {
        encoding: 'base64' as any,
      });
    }

    return StorageService.uploadFile(tempUri, {
      bucket: 'images',
      path: `users/${userId}/generations/${generationId}/original.png`,
      contentType: 'image/png',
    });
  },

  getImageUrl(userId: string, generationId: string): string {
    return StorageService.getCdnUrl(`r3al-premium-images/users/${userId}/generations/${generationId}/original.png`);
  },

  getThumbnailUrl(userId: string, generationId: string): string {
    return StorageService.getCdnUrl(`r3al-premium-images/users/${userId}/generations/${generationId}/thumbnail.png`);
  },
};

export const TacticalStorageService = {
  async uploadSecureFile(
    deptId: string,
    commId: string,
    fileUri: string,
    encrypt: boolean = true
  ): Promise<UploadResult> {
    return StorageService.uploadFile(fileUri, {
      bucket: 'tactical',
      path: `departments/${deptId}/comms/${commId}/${encrypt ? 'message.enc' : 'message.txt'}`,
      contentType: 'application/octet-stream',
    });
  },

  async uploadAttachment(
    deptId: string,
    commId: string,
    fileId: string,
    fileUri: string
  ): Promise<UploadResult> {
    return StorageService.uploadFile(fileUri, {
      bucket: 'tactical',
      path: `departments/${deptId}/comms/${commId}/attachments/${fileId}.enc`,
      contentType: 'application/octet-stream',
    });
  },
};

export const ProfileStorageService = {
  async uploadAvatar(userId: string, fileUri: string): Promise<UploadResult> {
    return StorageService.uploadFile(fileUri, {
      bucket: 'media',
      path: `users/${userId}/profile/avatar.jpg`,
      contentType: 'image/jpeg',
    });
  },

  async uploadPhoto(userId: string, photoId: string, fileUri: string): Promise<UploadResult> {
    return StorageService.uploadFile(fileUri, {
      bucket: 'media',
      path: `users/${userId}/profile/photos/${photoId}.jpg`,
      contentType: 'image/jpeg',
    });
  },

  async uploadNFT(userId: string, nftId: string, imageData: string): Promise<UploadResult> {
    const blob = await fetch(`data:image/png;base64,${imageData}`).then(r => r.blob());
    const tempUri = Platform.OS === 'web'
      ? URL.createObjectURL(blob)
      : `${FileSystem.documentDirectory}nft_${nftId}.png`;

    if (Platform.OS !== 'web') {
      await FileSystem.writeAsStringAsync(tempUri, imageData, {
        encoding: 'base64' as any,
      });
    }

    return StorageService.uploadFile(tempUri, {
      bucket: 'media',
      path: `users/${userId}/nfts/${nftId}.png`,
      contentType: 'image/png',
    });
  },

  getAvatarUrl(userId: string): string {
    return StorageService.getCdnUrl(`r3al-user-media/users/${userId}/profile/avatar.jpg`);
  },

  getPhotoUrl(userId: string, photoId: string): string {
    return StorageService.getCdnUrl(`r3al-user-media/users/${userId}/profile/photos/${photoId}.jpg`);
  },

  getNFTUrl(userId: string, nftId: string): string {
    return StorageService.getCdnUrl(`r3al-user-media/users/${userId}/nfts/${nftId}.png`);
  },
};
