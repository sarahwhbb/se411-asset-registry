package edu.psu.se411.backend;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@ExtendWith(MockitoExtension.class)
class AssetServiceTest {

	@Mock
	AssetRepository repository;

	@InjectMocks
	AssetService service;

	private Asset asset(Long id, String tag) {
		return new Asset(id, tag, "Dell", "Latitude", "S-" + tag, LocalDate.of(2024, 1, 1), "In use", "Sara", 1000.0);
	}

	@Test
	void createSavesAndReturnsTheAsset() {
		Asset input = asset(null, "PC-1");
		when(repository.save(input)).thenReturn(asset(1L, "PC-1"));

		assertEquals(1L, service.create(input).getId());
	}

	@Test
	void getReturnsTheAssetWhenItExists() {
		when(repository.findById(1L)).thenReturn(Optional.of(asset(1L, "PC-1")));

		assertEquals("PC-1", service.get(1L).getAssetTag());
	}

	@Test
	void getThrowsWhenMissing() {
		when(repository.findById(9L)).thenReturn(Optional.empty());

		assertThrows(AssetNotFoundException.class, () -> service.get(9L));
	}

	@Test
	void listReturnsTheRequestedPage() {
		Pageable pageable = PageRequest.of(0, 2);
		Page<Asset> page = new PageImpl<>(List.of(asset(1L, "PC-1"), asset(2L, "PC-2")), pageable, 5);
		when(repository.findAll(pageable)).thenReturn(page);

		Page<Asset> result = service.list(pageable);

		assertEquals(2, result.getContent().size());
		assertEquals(3, result.getTotalPages());
	}

	@Test
	void updateKeepsTheIdFromThePathAndSavesTheNewValues() {
		when(repository.existsById(1L)).thenReturn(true);
		when(repository.save(any(Asset.class))).thenAnswer(inv -> inv.getArgument(0));

		Asset saved = service.update(1L, asset(99L, "PC-NEW"));

		assertEquals(1L, saved.getId());
		assertEquals("PC-NEW", saved.getAssetTag());
	}

	@Test
	void updateThrowsWhenMissing() {
		when(repository.existsById(9L)).thenReturn(false);

		assertThrows(AssetNotFoundException.class, () -> service.update(9L, asset(null, "PC-1")));
		verify(repository, never()).save(any());
	}

	@Test
	void deleteRemovesTheAsset() {
		when(repository.existsById(1L)).thenReturn(true);

		service.delete(1L);

		verify(repository).deleteById(1L);
	}

	@Test
	void deleteThrowsWhenMissing() {
		when(repository.existsById(9L)).thenReturn(false);

		assertThrows(AssetNotFoundException.class, () -> service.delete(9L));
		verify(repository, never()).deleteById(any());
	}
}
